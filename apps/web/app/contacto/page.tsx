import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { SITE } from '@/lib/content';

export const metadata: Metadata = { title: 'Contacto', description: 'Cuéntenos qué necesita proteger, ordenar o transformar. Diseñaremos el acompañamiento adecuado para su organización.' };

export default function Page() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Conversemos</p>
      <h1 className="h1 mt-3 !text-4xl sm:!text-5xl">La próxima decisión importante merece una mirada integral.</h1>
      <p className="lead mt-4 max-w-3xl">Cuéntenos qué necesita proteger, ordenar o transformar. Diseñaremos el acompañamiento adecuado para su organización.</p>
      <div className="mt-10 grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3"><ContactForm /></div>
        <aside className="space-y-4 lg:col-span-2">
          <div className="card"><p className="eyebrow">Correo corporativo</p><a className="mt-2 block break-all hover:text-gold-400" href={`mailto:${SITE.email}`}>{SITE.email}</a></div>
          <div className="card"><p className="eyebrow">Teléfono / WhatsApp</p><a className="num mt-2 block hover:text-gold-400" href={`tel:+${SITE.whatsapp}`}>{SITE.phone}</a></div>
          <div className="card"><p className="eyebrow">Presencia</p><p className="mt-2">Colombia · Alcance nacional e internacional</p></div>
        </aside>
      </div>
    </div>
  );
}
