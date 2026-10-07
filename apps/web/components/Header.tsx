'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  ['/servicios', 'Servicios'], ['/sectores', 'Sectores'], ['/indicadores', 'Indicadores'],
  ['/nosotros', 'Nosotros'], ['/experiencia', 'Experiencia'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950/85 backdrop-blur">
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Integral Consulting SAS. – Inicio" onClick={() => setOpen(false)}>
          <Image src="/logo-mark.png" alt="" width={44} height={39} className="h-9 w-auto" priority />
          <span className="leading-none">
            <span className="block text-sm font-extrabold tracking-[0.3em] text-silver-100">INTEGRAL</span>
            <span className="block text-[10px] tracking-[0.35em] text-gold-500">CONSULTING S.A.S.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className={`text-sm transition hover:text-gold-400 ${path.startsWith(href) ? 'text-gold-400' : 'text-silver-300'}`}>{label}</Link>
          ))}
          <Link href="/contacto" className="btn-gold !py-2">Conversemos</Link>
        </nav>
        <button className="lg:hidden rounded-md border border-white/20 px-3 py-2 text-sm" aria-expanded={open} aria-controls="m-nav" onClick={() => setOpen(!open)}>
          {open ? 'Cerrar' : 'Menú'}
        </button>
      </div>
      {open && (
        <nav id="m-nav" className="wrap flex flex-col gap-1 pb-5 lg:hidden" aria-label="Móvil">
          {[...NAV, ['/contacto', 'Conversemos']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-md px-2 py-3 text-silver-100 hover:bg-white/5">{label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}
