'use client';
import { FormEvent, useEffect, useState } from 'react';
import type { Indicator } from '@/lib/types';

export default function AdminForm() {
  const [items, setItems] = useState<Indicator[]>([]);
  const [token, setToken] = useState('');
  const [out, setOut] = useState('');

  const load = () => fetch('/backend/indicators', { cache: 'no-store' }).then((r) => r.json()).then((j) => setItems(j.items.filter((i: Indicator) => i.manual)));
  useEffect(() => { load().catch(() => setOut('No se pudo cargar la API')); }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const code = String(f.get('code'));
    const r = await fetch(`/backend/admin/indicators/${code}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ value: Number(String(f.get('value')).replace(',', '.')), periodDate: f.get('periodDate'), demo: f.get('demo') === 'on' }),
    });
    setOut(r.ok ? `✔ ${code} actualizado` : r.status === 403 ? 'Token inválido' : `Error ${r.status}: revisa los datos`);
    if (r.ok) load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={submit} className="card space-y-4">
        <div><label className="label" htmlFor="tk">Token de administración</label><input id="tk" type="password" className="input" value={token} onChange={(e) => setToken(e.target.value)} /></div>
        <div><label className="label" htmlFor="code">Indicador</label><select id="code" name="code" className="input">{items.map((i) => <option key={i.code} value={i.code}>{i.label}</option>)}</select></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label" htmlFor="value">Valor</label><input id="value" name="value" required inputMode="decimal" className="input num" placeholder="5,10" /></div>
          <div><label className="label" htmlFor="pd">Periodo (AAAA-MM)</label><input id="pd" name="periodDate" required className="input" placeholder="2026-09" /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-silver-300"><input type="checkbox" name="demo" className="accent-[#C9A24B]" /> Marcar como dato de ejemplo</label>
        <button className="btn-gold">Guardar</button>
        {out && <p role="status" className="text-sm text-silver-300">{out}</p>}
      </form>
      <div className="card">
        <h3 className="mb-3 font-semibold">Valores manuales actuales</h3>
        <ul className="num divide-y divide-white/10 text-sm">
          {items.map((i) => <li key={i.code} className="flex justify-between py-2"><span className="text-silver-300">{i.label}</span><span>{i.value?.toLocaleString('es-CO')} {i.unit === '%' ? '%' : 'COP'} · {i.periodDate}{i.demo ? ' (ejemplo)' : ''}</span></li>)}
        </ul>
      </div>
    </div>
  );
}
