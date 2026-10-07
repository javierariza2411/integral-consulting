import Image from 'next/image';
import Link from 'next/link';
import LiveIndicators from '@/components/LiveIndicators';
import { getIndicators } from '@/lib/api';
import { CASES, DIFFERENTIATORS, METHOD, SECTORS, SERVICES } from '@/lib/content';

export default async function Home() {
  const ind = await getIndicators();
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="wrap grid items-center gap-8 pb-10 pt-12 lg:grid-cols-2 lg:pt-20">
          <div>
            <p className="eyebrow">Consultoría estratégica · Aseguramiento · Control fiscal</p>
            <h1 className="h1 mt-5">Rigor que protege.<br /><span className="text-gold-400">Visión que transforma.</span></h1>
            <p className="lead mt-6 max-w-xl">Convertimos la información contable, financiera y fiscal en claridad para decidir, control para actuar y confianza para crecer.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/servicios" className="btn-gold">Ver servicios</Link>
              <Link href="/indicadores" className="btn-ghost">Indicadores económicos</Link>
            </div>
            <p className="mt-8 text-xs uppercase tracking-[0.25em] text-silver-500">Más de 20 años · Alcance nacional e internacional</p>
          </div>
          <div className="relative mx-auto w-full max-w-xl">
            <Image src="/logo.png" alt="Integral Consulting S.A.S. – Estrategia financiera · Crecimiento sostenible" width={1535} height={1024} priority className="logo-fade w-full" />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-navy-900/60 py-10" aria-labelledby="ind-h">
        <div className="wrap">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div><p className="eyebrow">Para decidir informado</p><h2 id="ind-h" className="h2 mt-2 !text-2xl sm:!text-3xl">Indicadores económicos</h2></div>
            <Link href="/indicadores" className="text-sm text-gold-400 hover:underline">Ver panel completo →</Link>
          </div>
          <LiveIndicators initial={ind} codes={['TRM', 'EUR', 'IPC_ANUAL', 'IPC_MENSUAL', 'IVA']} />
        </div>
      </section>

      <section className="section" aria-labelledby="srv-h">
        <div className="wrap">
          <p className="eyebrow">Portafolio de servicios</p>
          <h2 id="srv-h" className="h2 mt-3">Soluciones para cada decisión crítica</h2>
          <p className="lead mt-4 max-w-3xl">Una arquitectura de servicios diseñada para fortalecer el control, proteger el patrimonio y liberar capacidad de gestión.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, idx) => (
              <Link key={s.slug} href={`/servicios/${s.slug}`} className="card group border-l-2 !border-l-burgundy-700">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-burgundy-600"><span className="text-gold-500">0{idx + 1}</span> · {s.tag}</p>
                <h3 className="mt-3 text-xl font-bold group-hover:text-gold-400">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-silver-300">{s.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-navy-900/50" aria-labelledby="dif-h">
        <div className="wrap">
          <p className="eyebrow">Diferenciales</p>
          <h2 id="dif-h" className="h2 mt-3">Confianza respaldada por métodos</h2>
          <p className="lead mt-4">La excelencia no se declara: se demuestra en la estructura de cada encargo.</p>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {DIFFERENTIATORS.map(([t, d], i) => (
              <div key={t} className={`card border-t-2 ${i % 2 ? '!border-t-gold-500' : '!border-t-burgundy-700'}`}>
                <p className="font-serif text-3xl text-gold-500">0{i + 1}</p>
                <h3 className="mt-2 font-bold">{t}</h3>
                <p className="mt-2 text-sm text-silver-300">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="met-h">
        <div className="wrap">
          <p className="eyebrow">Nuestra forma de trabajar</p>
          <h2 id="met-h" className="h2 mt-3">Del diagnóstico a la decisión</h2>
          <ol className="mt-10 grid gap-6 md:grid-cols-4">
            {METHOD.map(([t, d], i) => (
              <li key={t}>
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 font-bold text-navy-950">{i + 1}</span><span className="hidden h-px flex-1 bg-gold-500/60 md:block" /></div>
                <h3 className="mt-4 text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-silver-300">{d}</p>
              </li>
            ))}
          </ol>
          <blockquote className="mt-14 rounded-xl bg-navy-800 p-8 sm:p-12">
            <p className="font-serif text-2xl leading-snug sm:text-3xl">“Más que un proveedor de cumplimiento: un aliado para elevar la calidad de la gestión y la sostenibilidad del negocio.”</p>
            <footer className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-500">Propuesta de valor · Integral Consulting</footer>
          </blockquote>
        </div>
      </section>

      <section className="section bg-navy-900/50" aria-labelledby="sec-h">
        <div className="wrap">
          <p className="eyebrow">Especialización sectorial</p>
          <h2 id="sec-h" className="h2 mt-3">El contexto cambia, el rigor permanece.</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {SECTORS.map((s) => <Link key={s.name} href="/sectores" className="rounded-full border border-white/15 px-4 py-2 text-sm text-silver-300 hover:border-gold-500 hover:text-gold-400">{s.name}</Link>)}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="exp-h">
        <div className="wrap">
          <p className="eyebrow">Casos de éxito</p>
          <h2 id="exp-h" className="h2 mt-3">Experiencia que protege y fortalece organizaciones</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {CASES.map((c) => (
              <article key={c.title} className="card">
                <p className="text-xs uppercase tracking-widest text-gold-500">{c.sector}</p>
                <h3 className="mt-2 font-bold">{c.title}</h3>
                <p className="mt-1 text-xs text-silver-500">{c.role}</p>
                <p className="mt-3 line-clamp-5 text-sm text-silver-300">{c.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-8"><Link href="/experiencia" className="text-gold-400 hover:underline">Ver toda la experiencia →</Link></div>
        </div>
      </section>

      <section className="pb-24">
        <div className="wrap rounded-2xl border border-gold-500/30 bg-gradient-to-br from-navy-800 to-navy-950 p-10 text-center shadow-gold sm:p-16">
          <h2 className="h2">La próxima decisión importante merece una mirada integral.</h2>
          <p className="lead mx-auto mt-4 max-w-2xl">Cuéntenos qué necesita proteger, ordenar o transformar. Diseñaremos el acompañamiento adecuado para su organización.</p>
          <Link href="/contacto" className="btn-gold mt-8">Conversemos</Link>
        </div>
      </section>
    </>
  );
}
