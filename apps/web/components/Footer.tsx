import Image from 'next/image';
import Link from 'next/link';
import { SERVICES, SITE } from '@/lib/content';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-white/10 bg-navy-900/60">
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Image src="/logo-mark.png" alt="Integral Consulting SAS." width={110} height={97} className="h-20 w-auto" />
          <p className="mt-4 text-sm text-silver-300">Rigor que protege. Visión que transforma.</p>
        </div>
        <div>
          <p className="eyebrow mb-3">Servicios</p>
          <ul className="space-y-2 text-sm text-silver-300">
            {SERVICES.map((s) => <li key={s.slug}><Link className="hover:text-gold-400" href={`/servicios/${s.slug}`}>{s.title}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Firma</p>
          <ul className="space-y-2 text-sm text-silver-300">
            {[['/nosotros', 'Nosotros'], ['/sectores', 'Sectores'], ['/experiencia', 'Experiencia'], ['/indicadores', 'Indicadores económicos'], ['/contacto', 'Contacto']].map(([h, l]) => (
              <li key={h}><Link className="hover:text-gold-400" href={h}>{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Conversemos</p>
          <ul className="space-y-2 text-sm text-silver-300">
            <li><a className="hover:text-gold-400" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a className="hover:text-gold-400" href={`tel:+${SITE.whatsapp}`}>{SITE.phone}</a></li>
            <li>Colombia · Alcance nacional e internacional</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5">
        <div className="wrap flex flex-col justify-between gap-2 text-xs text-silver-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Integral Consulting SAS. Todos los derechos reservados.</span>
          <span className="flex gap-4">
            <Link href="/legal/privacidad" className="hover:text-gold-400">Política de privacidad</Link>
            <Link href="/legal/terminos" className="hover:text-gold-400">Términos y aviso</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
