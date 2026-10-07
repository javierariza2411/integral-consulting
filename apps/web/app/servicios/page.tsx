import type { Metadata } from 'next';
import Link from 'next/link';
import { SERVICES } from '@/lib/content';

export const metadata: Metadata = { title: 'Servicios', description: 'Consultoría contable y financiera, auditoría, revisoría fiscal, asesoría tributaria, control interno y auditoría especializada.' };

export default function Page() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Portafolio de servicios</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">Soluciones para cada decisión crítica</h1>
      <p className="lead mt-4 max-w-3xl">Una arquitectura de servicios diseñada para fortalecer el control, proteger el patrimonio y liberar capacidad de gestión.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <Link key={s.slug} href={`/servicios/${s.slug}`} className="card group border-l-2 !border-l-burgundy-700">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em]"><span className="text-gold-500">0{i + 1}</span> <span className="text-burgundy-600">· {s.tag}</span></p>
            <h2 className="mt-3 text-2xl font-bold group-hover:text-gold-400">{s.title}</h2>
            <p className="mt-3 text-sm text-silver-300">{s.summary}</p>
            <p className="mt-4 text-sm text-gold-400">Ver detalle →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
