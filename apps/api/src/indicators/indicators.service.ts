import { Injectable, Logger, NotFoundException, OnModuleInit, BadRequestException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';

export interface Point { date: string; value: number }
export interface Indicator {
  code: string; label: string; group: string; unit: 'COP' | '%'; value: number | null; change: number | null;
  periodDate: string | null; source: string; sourceUrl: string; frequency: string;
  manual: boolean; demo: boolean; stale: boolean; fetchedAt: string | null;
}

type Def = Omit<Indicator, 'value' | 'change' | 'periodDate' | 'demo' | 'stale' | 'fetchedAt'>;

const DANE = 'https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/indice-de-precios-al-consumidor-ipc';
const DEFS: Def[] = [
  { code: 'TRM', label: 'Dólar (TRM)', group: 'Divisas', unit: 'COP', source: 'Superintendencia Financiera (datos.gov.co)', sourceUrl: 'https://www.datos.gov.co/d/32sa-8pi3', frequency: 'Diaria (días hábiles)', manual: false },
  { code: 'EUR', label: 'Euro (EUR/COP)', group: 'Divisas', unit: 'COP', source: 'ExchangeRate-API (referencia de mercado)', sourceUrl: 'https://www.exchangerate-api.com', frequency: 'Diaria', manual: false },
  { code: 'IPC_MENSUAL', label: 'IPC mensual', group: 'Precios e inflación', unit: '%', source: 'DANE', sourceUrl: DANE, frequency: 'Mensual', manual: true },
  { code: 'IPC_ANUAL', label: 'Inflación anual (IPC)', group: 'Precios e inflación', unit: '%', source: 'DANE', sourceUrl: DANE, frequency: 'Mensual', manual: true },
  { code: 'TASA_BR', label: 'Tasa de intervención', group: 'Tasas', unit: '%', source: 'Banco de la República', sourceUrl: 'https://www.banrep.gov.co/es/estadisticas/tasas-interes-politica-monetaria', frequency: 'Por decisión de la Junta', manual: true },
  { code: 'DTF', label: 'DTF (E.A.)', group: 'Tasas', unit: '%', source: 'Banco de la República', sourceUrl: 'https://www.banrep.gov.co/es/estadisticas/dtf', frequency: 'Semanal', manual: true },
  { code: 'IVA', label: 'IVA tarifa general', group: 'Tributario', unit: '%', source: 'Estatuto Tributario (art. 468)', sourceUrl: 'https://www.dian.gov.co', frequency: 'Por norma', manual: true },
  { code: 'UVT', label: 'UVT vigente', group: 'Tributario', unit: 'COP', source: 'DIAN', sourceUrl: 'https://www.dian.gov.co', frequency: 'Anual', manual: true },
  { code: 'SMMLV', label: 'Salario mínimo (SMMLV)', group: 'Tributario', unit: 'COP', source: 'Gobierno Nacional (decreto anual)', sourceUrl: 'https://www.mintrabajo.gov.co', frequency: 'Anual', manual: true },
];

// Valores iniciales. demo=true => el sitio muestra "Dato de ejemplo" hasta que se actualice en /admin.
const SEED: Record<string, { value: number; periodDate: string; demo: boolean }> = {
  IPC_MENSUAL: { value: 0.3, periodDate: '2026-09', demo: true },
  IPC_ANUAL: { value: 5.0, periodDate: '2026-09', demo: true },
  TASA_BR: { value: 9.25, periodDate: '2026-09', demo: true },
  DTF: { value: 9.0, periodDate: '2026-10', demo: true },
  IVA: { value: 19, periodDate: '2026', demo: false },
  UVT: { value: 52374, periodDate: '2026', demo: true },
  SMMLV: { value: 1750905, periodDate: '2026', demo: true },
};

@Injectable()
export class IndicatorsService implements OnModuleInit {
  private readonly log = new Logger('Indicators');
  private readonly file = path.join(process.env.DATA_DIR || './data', 'manual.json');
  private manual: Record<string, { value: number; periodDate: string; demo: boolean; history: Point[] }> = {};
  private live: Record<string, { value: number; change: number | null; periodDate: string; fetchedAt: string; stale: boolean }> = {};
  private trmHistory: Point[] = [];

  async onModuleInit() {
    this.loadManual();
    this.refresh(); // sin await: el servidor arranca aunque las fuentes tarden
  }

  private loadManual() {
    try {
      this.manual = JSON.parse(fs.readFileSync(this.file, 'utf8'));
    } catch {
      this.manual = {};
    }
    for (const [code, s] of Object.entries(SEED)) {
      if (!this.manual[code]) this.manual[code] = { ...s, history: [{ date: s.periodDate, value: s.value }] };
    }
  }

  private saveManual() {
    try {
      fs.mkdirSync(path.dirname(this.file), { recursive: true });
      fs.writeFileSync(this.file, JSON.stringify(this.manual, null, 2));
    } catch (e) {
      this.log.warn(`No se pudo persistir valores manuales: ${(e as Error).message}`);
    }
  }

  updateManual(code: string, dto: { value: number; periodDate: string; demo?: boolean }) {
    const def = DEFS.find((d) => d.code === code);
    if (!def || !def.manual) throw new NotFoundException('Indicador manual no encontrado');
    const cur = this.manual[code];
    const history = [...(cur?.history || []).filter((p) => p.date !== dto.periodDate), { date: dto.periodDate, value: dto.value }]
      .sort((a, b) => a.date.localeCompare(b.date)).slice(-36);
    this.manual[code] = { value: dto.value, periodDate: dto.periodDate, demo: !!dto.demo, history };
    this.saveManual();
    return this.list().items.find((i) => i.code === code);
  }

  @Cron('*/30 * * * *')
  async refresh() {
    await Promise.allSettled([this.fetchTrm(), this.fetchEur()]);
  }

  private async getJson(url: string) {
    const res = await fetch(url, { signal: AbortSignal.timeout(12_000), headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  private markStale(code: string) {
    if (this.live[code]) this.live[code].stale = true;
  }

  private async fetchTrm() {
    try {
      const u = new URL('https://www.datos.gov.co/resource/32sa-8pi3.json');
      u.searchParams.set('$select', 'valor,vigenciadesde');
      u.searchParams.set('$order', 'vigenciadesde DESC');
      u.searchParams.set('$limit', '400');
      const rows: { valor: string; vigenciadesde: string }[] = await this.getJson(u.toString());
      const pts = rows
        .map((r) => ({ date: r.vigenciadesde.slice(0, 10), value: Number(r.valor) }))
        .filter((p) => Number.isFinite(p.value))
        .reverse();
      if (pts.length < 2) throw new Error('Respuesta vacía');
      this.trmHistory = pts;
      const last = pts[pts.length - 1], prev = pts[pts.length - 2];
      this.live.TRM = {
        value: last.value,
        change: ((last.value - prev.value) / prev.value) * 100,
        periodDate: last.date,
        fetchedAt: new Date().toISOString(),
        stale: false,
      };
    } catch (e) {
      this.log.warn(`TRM falló: ${(e as Error).message}`);
      this.markStale('TRM');
    }
  }

  private async fetchEur() {
    try {
      const j = await this.getJson('https://open.er-api.com/v6/latest/USD');
      const cop = j?.rates?.COP, eur = j?.rates?.EUR;
      if (!cop || !eur) throw new Error('Tasas no disponibles');
      const value = cop / eur;
      const prev = this.live.EUR?.value;
      this.live.EUR = {
        value,
        change: prev ? ((value - prev) / prev) * 100 : null,
        periodDate: new Date(j.time_last_update_utc || Date.now()).toISOString().slice(0, 10),
        fetchedAt: new Date().toISOString(),
        stale: false,
      };
    } catch (e) {
      this.log.warn(`EUR falló: ${(e as Error).message}`);
      this.markStale('EUR');
    }
  }

  list() {
    const items: Indicator[] = DEFS.map((d) => {
      if (d.manual) {
        const m = this.manual[d.code];
        const h = m?.history || [];
        const prev = h.length > 1 ? h[h.length - 2].value : null;
        return {
          ...d, value: m?.value ?? null, periodDate: m?.periodDate ?? null, demo: !!m?.demo, stale: false, fetchedAt: null,
          change: prev ? ((m.value - prev) / prev) * 100 : null,
        };
      }
      const l = this.live[d.code];
      return {
        ...d, value: l?.value ?? null, change: l?.change ?? null, periodDate: l?.periodDate ?? null,
        demo: false, stale: l ? l.stale : true, fetchedAt: l?.fetchedAt ?? null,
      };
    });
    return { updatedAt: new Date().toISOString(), items };
  }

  history(code: string, range: string) {
    const def = DEFS.find((d) => d.code === code);
    if (!def) throw new NotFoundException('Indicador no encontrado');
    if (!['7d', '30d', '12m'].includes(range)) throw new BadRequestException('range inválido (7d, 30d, 12m)');
    let pts: Point[] = def.manual ? this.manual[code]?.history || [] : code === 'TRM' ? this.trmHistory : [];
    if (code === 'TRM') {
      const days = range === '7d' ? 7 : range === '30d' ? 30 : 365;
      const from = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
      pts = pts.filter((p) => p.date >= from);
    }
    return { code, range, unit: def.unit, points: pts };
  }
}
