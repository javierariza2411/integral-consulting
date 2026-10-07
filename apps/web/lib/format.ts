import type { Indicator } from './types';

export function fmtValue(i: Pick<Indicator, 'value' | 'unit'>): string {
  if (i.value == null) return '—';
  if (i.unit === 'COP') {
    return '$ ' + i.value.toLocaleString('es-CO', { minimumFractionDigits: i.value < 100000 ? 2 : 0, maximumFractionDigits: 2 });
  }
  return i.value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' %';
}

export function fmtChange(c: number | null): string {
  if (c == null) return '';
  return `${c > 0 ? '▲' : c < 0 ? '▼' : '■'} ${Math.abs(c).toLocaleString('es-CO', { maximumFractionDigits: 2 })} %`;
}

export function fmtPeriod(p: string | null): string {
  if (!p) return 'sin dato';
  const [y, m, d] = p.split('-').map(Number);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  if (!m) return String(y);
  return d ? `${d} ${months[m - 1]} ${y}` : `${months[m - 1]} ${y}`;
}
