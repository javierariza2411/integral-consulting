import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Términos y aviso legal' };

export default function Page() {
  return (
    <article className="wrap section max-w-3xl space-y-4 text-sm leading-relaxed text-silver-300">
      <h1 className="h2 text-silver-100">Términos de uso y aviso sobre la información económica</h1>
      <p className="rounded border border-burgundy-700 p-3 text-xs">Borrador base. Debe ser revisado por el asesor legal antes de la publicación definitiva.</p>
      <p>Los indicadores económicos publicados (TRM, tipos de cambio, IPC, inflación, tasas, IVA, UVT, salario mínimo y similares) provienen de fuentes de terceros y se presentan únicamente con fines informativos. Pueden tener rezagos, errores o actualizarse con una frecuencia distinta a la de la fuente.</p>
      <p>La información no constituye asesoría contable, tributaria, financiera ni legal, ni una recomendación de inversión. Antes de tomar decisiones, consulte la fuente oficial y a un profesional.</p>
      <p>Integral Consulting SAS. no responde por decisiones tomadas con base exclusiva en la información de este sitio. Los contenidos, marcas y logos son propiedad de Integral Consulting SAS.</p>
    </article>
  );
}
