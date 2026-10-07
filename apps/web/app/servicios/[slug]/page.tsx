import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SERVICES } from '@/lib/content';

export const dynamicParams = false;
export function generateStaticParams() { return SERVICES.map((s) => ({ slug: s.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = SERVICES.find((x) => x.slug === params.slug);
  return s ? { title: s.title, description: s.summary } : {};
}

const List = ({ title, items }: { title: string; items: string[] }) => (
  <div className="card">
    <h2 className="eyebrow mb-4">{title}</h2>
    <ul className="space-y-2 text-sm text-silver-300">{items.map((i) => <li key={i} className="flex gap-2"><span className="text-gold-500">▸</span>{i}</li>)}</ul>
  </div>
);

export default function Page({ params }: { params: { slug: string } }) {
  const s = SERVICES.find((x) => x.slug === params.slug);
  if (!s) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'Service', name: s.title, description: s.summary, provider: { '@type': 'ProfessionalService', name: 'Integral Consulting SAS.' }, areaServed: 'CO' };
  return (
    <div className="wrap section">
      <Link href="/servicios" className="text-sm text-gold-400 hover:underline">← Todos los servicios</Link>
      <p className="eyebrow mt-6">{s.tag}</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">{s.title}</h1>
      <p className="lead mt-5 max-w-3xl">{s.summary}</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <List title="Alcance" items={s.scope} />
        <List title="Entregables" items={s.deliverables} />
        <List title="Estándares y referentes" items={s.standards} />
        <List title="Sectores relacionados" items={s.sectors} />
      </div>
      <p className="mt-8 text-xs text-silver-500">La aplicación de cada estándar se valida en la etapa de diagnóstico, considerando la naturaleza jurídica, el tamaño, el sector, la jurisdicción y el objeto del encargo.</p>
      <Link href="/contacto" className="btn-gold mt-8">Conversemos sobre este servicio</Link>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
