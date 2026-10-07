import type { MetadataRoute } from 'next';
import { SERVICES, SITE } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, '');
  const pages = ['', '/servicios', '/sectores', '/indicadores', '/nosotros', '/experiencia', '/contacto', '/legal/privacidad', '/legal/terminos'];
  return [...pages, ...SERVICES.map((s) => `/servicios/${s.slug}`)].map((p) => ({ url: base + p, lastModified: new Date() }));
}
