import type { Metadata } from 'next';
import { SECTORS } from '@/lib/content';

export const metadata: Metadata = { title: 'Especialización sectorial', description: 'Salud, ESAL, sector solidario, grupos empresariales, comercio, industria y sector público.' };

export default function Page() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Especialización sectorial</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">El contexto cambia, el rigor permanece.</h1>
      <p className="lead mt-4 max-w-3xl">Adaptamos la solución a la lógica económica, regulatoria y operativa de cada sector.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SECTORS.map((s) => (
          <article key={s.name} className="card">
            <h2 className="font-bold">{s.name}</h2>
            <p className="mt-3 text-sm text-silver-300">{s.text}</p>
            <div className="mt-4 flex flex-wrap gap-2">{s.tags.map((t) => <span key={t} className="rounded-full border border-gold-500/40 px-3 py-1 text-xs text-gold-400">{t}</span>)}</div>
          </article>
        ))}
      </div>
    </div>
  );
}
