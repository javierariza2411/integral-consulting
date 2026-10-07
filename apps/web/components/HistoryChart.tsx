'use client';
import { useEffect, useMemo, useState } from 'react';
import type { Point } from '@/lib/types';

const RANGES = [['7d', '7 días'], ['30d', '30 días'], ['12m', '12 meses']] as const;
const W = 720, H = 260, P = { l: 56, r: 12, t: 14, b: 28 };

export default function HistoryChart({ code = 'TRM', title = 'TRM · histórico' }: { code?: string; title?: string }) {
  const [range, setRange] = useState<string>('30d');
  const [pts, setPts] = useState<Point[] | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    setPts(null);
    fetch(`/backend/indicators/${code}/history?range=${range}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => alive && setPts(j.points))
      .catch(() => alive && setPts([]));
    return () => { alive = false; };
  }, [code, range]);

  const g = useMemo(() => {
    if (!pts || pts.length < 2) return null;
    const vs = pts.map((p) => p.value);
    const min = Math.min(...vs), max = Math.max(...vs), pad = (max - min) * 0.12 || 1;
    const lo = min - pad, hi = max + pad;
    const x = (i: number) => P.l + (i / (pts.length - 1)) * (W - P.l - P.r);
    const y = (v: number) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b);
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
    const area = `${line} L${x(pts.length - 1)},${H - P.b} L${x(0)},${H - P.b} Z`;
    const ticks = [lo + pad, (lo + hi) / 2, hi - pad];
    return { x, y, line, area, ticks };
  }, [pts]);

  const hp = hover != null && pts ? pts[hover] : null;

  return (
    <div className="card">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex gap-1" role="tablist" aria-label="Rango">
          {RANGES.map(([k, l]) => (
            <button key={k} role="tab" aria-selected={range === k} onClick={() => setRange(k)}
              className={`rounded px-3 py-1 text-xs ${range === k ? 'bg-gold-500 text-navy-950' : 'border border-white/15 text-silver-300 hover:text-gold-400'}`}>{l}</button>
          ))}
        </div>
      </div>
      {pts === null && <div className="h-[260px] animate-pulse rounded bg-white/5" />}
      {pts && !g && <p className="py-16 text-center text-sm text-silver-300">No hay datos suficientes para este rango.</p>}
      {g && pts && (
        <div className="relative">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${title}, ${range}`}
            onMouseLeave={() => setHover(null)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const px = ((e.clientX - r.left) / r.width) * W;
              setHover(Math.max(0, Math.min(pts.length - 1, Math.round(((px - P.l) / (W - P.l - P.r)) * (pts.length - 1)))));
            }}>
            <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#C9A24B" stopOpacity=".35" /><stop offset="1" stopColor="#C9A24B" stopOpacity="0" /></linearGradient></defs>
            {g.ticks.map((t) => (
              <g key={t}>
                <line x1={P.l} x2={W - P.r} y1={g.y(t)} y2={g.y(t)} stroke="rgba(255,255,255,.08)" />
                <text x={P.l - 8} y={g.y(t) + 4} textAnchor="end" fontSize="11" fill="#7F8DA3">{Math.round(t).toLocaleString('es-CO')}</text>
              </g>
            ))}
            <path d={g.area} fill="url(#ga)" />
            <path d={g.line} fill="none" stroke="#E0BC6A" strokeWidth="2" strokeLinejoin="round" />
            <text x={P.l} y={H - 8} fontSize="11" fill="#7F8DA3">{pts[0].date}</text>
            <text x={W - P.r} y={H - 8} fontSize="11" fill="#7F8DA3" textAnchor="end">{pts[pts.length - 1].date}</text>
            {hp && <g><line x1={g.x(hover!)} x2={g.x(hover!)} y1={P.t} y2={H - P.b} stroke="#C9A24B" strokeDasharray="3 3" /><circle cx={g.x(hover!)} cy={g.y(hp.value)} r="4" fill="#E0BC6A" /></g>}
          </svg>
          <p className="num mt-2 h-5 text-sm text-silver-300">{hp ? `${hp.date} · $ ${hp.value.toLocaleString('es-CO', { minimumFractionDigits: 2 })}` : 'Pasa el cursor sobre la gráfica para ver el valor diario.'}</p>
        </div>
      )}
    </div>
  );
}
