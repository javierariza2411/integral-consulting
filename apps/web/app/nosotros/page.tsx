import type { Metadata } from 'next';
import { DIFFERENTIATORS, PRINCIPLES } from '@/lib/content';

export const metadata: Metadata = { title: 'Nosotros', description: 'El socio estratégico de la alta dirección. Misión, visión 2030 y principios de Integral Consulting SAS.' };

export default function Page() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Nuestra firma</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">El socio estratégico de la alta dirección</h1>
      <p className="lead mt-5 max-w-3xl">Convertimos la información contable, financiera y fiscal en claridad para decidir, control para actuar y confianza para crecer.</p>
      <div className="mt-8 grid max-w-4xl gap-5 text-silver-300 md:grid-cols-2">
        <p>Integral Consulting SAS. es una firma de consultoría estratégica y aseguramiento con alcance nacional e internacional y más de 20 años de experiencia. Acompañamos a organizaciones públicas y privadas en la protección de su patrimonio, el cumplimiento de sus obligaciones y la toma de decisiones.</p>
        <p>Integramos rigurosidad técnica, conocimiento sectorial y herramientas de analítica de datos para resolver problemas complejos y simplificar entornos regulatorios exigentes. Nuestro modelo combina agilidad, flexibilidad operativa y acompañamiento directo a la alta gerencia.</p>
      </div>
      <p className="mt-8 rounded-lg border-l-2 border-gold-500 bg-navy-800/70 p-5"><strong className="text-gold-400">Promesa de marca.</strong> Proteger el valor de la organización con criterio independiente, respuestas oportunas y soluciones que conectan regulación, operación y estrategia.</p>

      <h2 className="h2 mt-16">Misión y visión</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="card"><h3 className="eyebrow mb-3">Misión</h3><p className="text-sm leading-relaxed text-silver-300">Brindar servicios integrales de consultoría contable, auditoría, asesoría tributaria y revisoría fiscal de la más alta calidad, con alcance nacional e internacional, impulsando la solidez financiera y el cumplimiento normativo de nuestros clientes. Generamos valor sostenible mediante soluciones flexibles y adaptadas a cada organización, protegiendo el patrimonio y transformando la información financiera en una ventaja estratégica.</p></div>
        <div className="card"><h3 className="eyebrow mb-3">Visión 2030</h3><p className="text-sm leading-relaxed text-silver-300">Ser una firma de consultoría y aseguramiento multijurisdiccional de referencia internacional, reconocida por su excelencia operativa, capacidad de adaptación e integración de soluciones tecnológicas avanzadas. Ser el socio estratégico global preferido por organizaciones en expansión, guiándolas con liderazgo, precisión y rigor ético.</p></div>
      </div>
      <p className="mt-5 rounded-lg border-l-2 border-gold-500 bg-navy-800/70 p-5 text-sm text-silver-300"><strong className="text-gold-400">Ambición estratégica.</strong> Consolidar un modelo de excelencia técnica, desarrollar una experiencia de cliente diferenciada, establecer alianzas en mercados clave de Latinoamérica y Norteamérica e integrar analítica de datos en la mayoría de los encargos de auditoría y revisoría fiscal.</p>

      <h2 className="h2 mt-16">Principios</h2>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map(([t, d]) => <div key={t} className="card !p-5"><dt className="font-bold text-gold-400">{t}</dt><dd className="mt-1 text-sm text-silver-300">{d}</dd></div>)}
      </dl>

      <h2 className="h2 mt-16">Por qué Integral</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {DIFFERENTIATORS.map(([t, d]) => <div key={t} className="card"><h3 className="font-bold">{t}</h3><p className="mt-2 text-sm text-silver-300">{d}</p></div>)}
      </div>
    </div>
  );
}
