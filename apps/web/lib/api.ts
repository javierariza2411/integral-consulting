import type { IndicatorsResponse } from './types';

const API = (process.env.API_URL || 'http://localhost:4000').replace(/\/$/, '');

export async function getIndicators(): Promise<IndicatorsResponse | null> {
  try {
    const r = await fetch(`${API}/indicators`, { next: { revalidate: 300 } });
    return r.ok ? ((await r.json()) as IndicatorsResponse) : null;
  } catch {
    return null;
  }
}
