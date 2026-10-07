'use client';
import { useState } from 'react';

const n = (v: number, d = 2) => v.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });

export function Converter({ trm, eur }: { trm: number | null; eur: number | null }) {
  const [amount, setAmount] = useState('100');
  const [cur, setCur] = useState<'USD' | 'EUR'>('USD');
  const [dir, setDir] = useState<'toCOP' | 'fromCOP'>('toCOP');
  const rate = cur === 'USD' ? trm : eur;
  const a = parseFloat(amount.replace(',', '.'));
  const res = rate && Number.isFinite(a) ? (dir === 'toCOP' ? a * rate : a / rate) : null;
  return (
    <div className="card">
      <h3 className="font-semibold">Conversor de divisas</h3>
      <p className="mt-1 text-xs text-silver-500">USD con la TRM vigente; EUR con tasa de mercado de referencia.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="label" htmlFor="cv-a">Monto</label><input id="cv-a" className="input num" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div><label className="label" htmlFor="cv-c">Divisa</label><select id="cv-c" className="input" value={cur} onChange={(e) => setCur(e.target.value as 'USD' | 'EUR')}><option>USD</option><option>EUR</option></select></div>
        <div><label className="label" htmlFor="cv-d">Sentido</label><select id="cv-d" className="input" value={dir} onChange={(e) => setDir(e.target.value as 'toCOP' | 'fromCOP')}><option value="toCOP">{cur} → COP</option><option value="fromCOP">COP → {cur}</option></select></div>
      </div>
      <p className="num mt-5 text-2xl font-bold text-gold-400">{res == null ? 'Tasa no disponible' : dir === 'toCOP' ? `$ ${n(res)} COP` : `${n(res)} ${cur}`}</p>
    </div>
  );
}

export function VatCalc({ defaultRate = 19 }: { defaultRate?: number }) {
  const [amount, setAmount] = useState('1000000');
  const [rate, setRate] = useState(String(defaultRate));
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const a = parseFloat(amount.replace(/\./g, '').replace(',', '.'));
  const r = parseFloat(rate) / 100;
  const ok = Number.isFinite(a) && Number.isFinite(r);
  const base = ok ? (mode === 'add' ? a : a / (1 + r)) : 0;
  const iva = base * r, total = base + iva;
  return (
    <div className="card">
      <h3 className="font-semibold">Calculadora de IVA</h3>
      <p className="mt-1 text-xs text-silver-500">Cálculo de referencia. No reemplaza la liquidación oficial.</p>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="col-span-2"><label className="label" htmlFor="vc-a">Valor (COP)</label><input id="vc-a" className="input num" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
        <div><label className="label" htmlFor="vc-r">Tarifa</label><select id="vc-r" className="input" value={rate} onChange={(e) => setRate(e.target.value)}><option value="0">0 %</option><option value="5">5 %</option><option value={String(defaultRate)}>{defaultRate} % (general)</option></select></div>
        <div><label className="label" htmlFor="vc-m">El valor es…</label><select id="vc-m" className="input" value={mode} onChange={(e) => setMode(e.target.value as 'add' | 'remove')}><option value="add">Base (sin IVA)</option><option value="remove">Total (con IVA)</option></select></div>
      </div>
      {ok && <dl className="num mt-5 space-y-1 text-sm"><div className="flex justify-between"><dt className="text-silver-300">Base</dt><dd>$ {n(base, 0)}</dd></div><div className="flex justify-between"><dt className="text-silver-300">IVA</dt><dd>$ {n(iva, 0)}</dd></div><div className="flex justify-between border-t border-white/10 pt-2 text-lg font-bold text-gold-400"><dt>Total</dt><dd>$ {n(total, 0)}</dd></div></dl>}
    </div>
  );
}
