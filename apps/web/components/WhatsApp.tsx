import { SITE } from '@/lib/content';

export default function WhatsApp() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hola, quisiera información sobre los servicios de Integral Consulting.')}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Escribir por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-400">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/></svg>
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
