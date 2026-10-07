import type { Metadata } from 'next';
import LiveIndicators from '@/components/LiveIndicators';
import HistoryChart from '@/components/HistoryChart';
import { Converter, VatCalc } from '@/components/Tools';
import { getIndicators } from '@/lib/api';

export const metadata: Metadata = { title: 'Indicadores económicos de Colombia', description: 'TRM, dólar, euro, IPC, inflación, tasas, IVA, UVT y salario mínimo con su fuente y fecha de actualización.' };
export const revalidate = 300;

export default async function Page() {
  const ind = await getIndicators();
  const get = (c: string) => ind?.items.find((i) => i.code === c);
  return (
    <div className="wrap section">
      <p className="eyebrow">Para decidir informado</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">Indicadores económicos</h1>
      <p className="lead mt-4 max-w-3xl">Los datos clave de Colombia en un solo lugar. Cada indicador muestra su fuente oficial, su frecuencia de publicación y la fecha del dato.</p>
      <div className="mt-10"><LiveIndicators initial={ind} grouped /></div>
      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3"><HistoryChart code="TRM" title="Dólar (TRM) · histórico" /></div>
        <div className="space-y-6 lg:col-span-2">
          <Converter trm={get('TRM')?.value ?? null} eur={get('EUR')?.value ?? null} />
          <VatCalc defaultRate={get('IVA')?.value ?? 19} />
        </div>
      </div>
      <p className="mt-10 rounded-lg border border-white/10 p-4 text-xs leading-relaxed text-silver-500">
        <strong className="text-silver-300">Aviso:</strong> información de referencia, sin carácter de asesoría. Algunos indicadores (IPC, inflación, tasas, UVT, IVA, salario mínimo) se publican mensual, semanal o anualmente y se actualizan en este sitio cuando la fuente los publica. Consulte siempre la fuente oficial antes de tomar decisiones.
      </p>
    </div>
  );
}
