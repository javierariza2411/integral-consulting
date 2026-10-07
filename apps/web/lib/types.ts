export interface Indicator {
  code: string; label: string; group: string; unit: 'COP' | '%'; value: number | null; change: number | null;
  periodDate: string | null; source: string; sourceUrl: string; frequency: string;
  manual: boolean; demo: boolean; stale: boolean; fetchedAt: string | null;
}
export interface IndicatorsResponse { updatedAt: string; items: Indicator[] }
export interface Point { date: string; value: number }
