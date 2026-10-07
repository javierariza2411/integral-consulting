import type { Metadata } from 'next';
import { CASES, INTERNATIONAL } from '@/lib/content';

export const metadata: Metadata = { title: 'Experiencia y casos de éxito', description: 'Recuperación financiera, estructuración institucional, auditoría y cumplimiento en salud, ESAL y cooperación internacional.' };

export default function Page() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Casos de éxito y experiencia sectorial</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">Experiencia que protege y fortalece organizaciones</h1>
      <p className="lead mt-4 max-w-3xl">Intervenciones ejecutivas en recuperación financiera, estructuración institucional, auditoría y cumplimiento.</p>

      <h2 className="mt-12 text-xl font-bold text-burgundy-600">Sector salud · Recuperación, creación y consolidación institucional</h2>
      <div className="mt-5 space-y-5">
        {CASES.map((c) => (
          <article key={c.title} className="card">
            <h3 className="text-lg font-bold">{c.title}</h3>
            <p className="text-sm text-gold-500">{c.role}</p>
            <p className="mt-3 text-sm text-silver-300">{c.text}</p>
          </article>
        ))}
      </div>

      <h2 className="mt-14 text-xl font-bold text-burgundy-600">Cooperación internacional y organizaciones sociales</h2>
      <p className="mt-3 max-w-3xl text-silver-300">Auditoría y aseguramiento de proyectos financiados por cooperación internacional: revisión financiera, evaluación de la ejecución, control y emisión de informes para entidades financiadoras internacionales. Experiencia en proyectos de paz, derechos humanos y fortalecimiento comunitario.</p>
      <ul className="mt-6 grid gap-5 md:grid-cols-3">
        {INTERNATIONAL.map(([c, t, y]) => <li key={c} className="card"><p className="font-bold text-gold-400">{c}</p><p className="mt-2 text-sm text-silver-300">{t}</p><p className="mt-3 text-xs text-silver-500">{y}</p></li>)}
      </ul>
      <div className="card mt-5"><p className="font-bold">Auditoría nacional</p><p className="mt-1 text-sm text-silver-300">Corporación Caribe Afirmativo — Auditoría externa de las vigencias 2022–2024.</p></div>

      <h2 className="mt-14 text-xl font-bold text-burgundy-600">Sectores y capacidades demostradas</h2>
      <p className="mt-3 italic text-silver-300">Salud y entidades vigiladas · ESAL y fundaciones · Cooperación internacional · Organizaciones sociales · Auditoría financiera y de proyectos · Recuperación financiera · Estructuración contable, financiera y tributaria · Cumplimiento regulatorio.</p>
    </div>
  );
}
