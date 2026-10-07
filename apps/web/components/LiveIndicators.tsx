'use client';
import { useEffect, useState } from 'react';
import type { Indicator, IndicatorsResponse } from '@/lib/types';
import { fmtChange, fmtPeriod, fmtValue } from '@/lib/format';

interface Props { initial: IndicatorsResponse | null; codes?: string[]; grouped?: boolean }

export default function LiveIndicators({ initial, codes, grouped }: Props) {
  const [data, setData] = useState<IndicatorsResponse | null>(initial);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch('/backend/indicators', { cache: 'no-store' });
        if (!r.ok) throw new Error();
        const j = (await r.json()) as IndicatorsResponse;
        if (alive) { setData(j); setFailed(false); }
      } catch { if (alive) setFailed(true); }
    };
    if (!initial) load();
    const t = setInterval(load, 5 * 60 * 1000);
    return () => { alive = false; clearInterval(t); };
  }, [initial]);

  if (!data) {
    return <p className="rounded-lg border border-white/10 p-6 text-sm text-silver-300">{failed ? 'Los indicadores no están disponibles en este momento. Intenta de nuevo en unos minutos.' : 'Cargando indicadores…'}</p>;
  }

  const items = codes ? codes.map((c) => data.items.find((i) => i.code === c)).filter(Boolean) as Indicator[] : data.items;
  const groups = grouped ? Array.from(new Set(items.map((i) => i.group))) : [''];

  return (
    <div>
      {groups.map((g) => (
        <div key={g} className="mb-8">
          {g && <h3 className="eyebrow mb-4">{g}</h3>}
          <div className={`grid gap-4 ${grouped ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-5'}`}>
            {items.filter((i) => !g || i.group === g).map((i) => <Card key={i.code} i={i} />)}
          </div>
        </div>
      ))}
      <p className="text-xs text-silver-500">
        Actualizado: {new Date(data.updatedAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
        {failed && ' · Mostrando el último dato disponible'}
      </p>
    </div>
  );
}

function Card({ i }: { i: Indicator }) {
  const tone = i.change == null || i.change === 0 ? 'text-silver-300' : i.change > 0 ? 'text-up' : 'text-down';
  return (
    <article className="card !p-5">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-silver-300">{i.label}</h4>
        {i.demo && <span className="rounded bg-burgundy-700/60 px-1.5 py-0.5 text-[10px] font-semibold text-silver-100">Dato de ejemplo</span>}
        {i.stale && !i.demo && <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-silver-300">Dato anterior</span>}
      </div>
      <p className="num mt-3 text-3xl font-bold text-silver-100">{fmtValue(i)}</p>
      <p className={`num mt-1 h-5 text-xs ${tone}`}>{fmtChange(i.change)}</p>
      <p className="mt-3 text-[11px] leading-snug text-silver-500">
        {i.frequency} · {fmtPeriod(i.periodDate)}<br />
        Fuente: <a href={i.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-gold-500/50 hover:text-gold-400">{i.source}</a>
      </p>
    </article>
  );
}
