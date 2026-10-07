import type { Metadata } from 'next';
import { SITE } from '@/lib/content';

export const metadata: Metadata = { title: 'Política de privacidad' };

export default function Page() {
  return (
    <article className="wrap section max-w-3xl space-y-4 text-sm leading-relaxed text-silver-300">
      <h1 className="h2 text-silver-100">Política de tratamiento de datos personales</h1>
      <p className="rounded border border-burgundy-700 p-3 text-xs">Borrador base. Debe ser revisado y aprobado por el asesor legal de Integral Consulting SAS. antes de la publicación definitiva.</p>
      <p><strong>Responsable:</strong> Integral Consulting SAS., Colombia. Contacto: {SITE.email}.</p>
      <p><strong>Marco legal:</strong> Ley 1581 de 2012 y normas que la reglamentan (Decreto 1074 de 2015, Capítulo 25).</p>
      <p><strong>Datos que recolectamos:</strong> nombre, correo, teléfono, organización y el mensaje que usted escribe en el formulario de contacto.</p>
      <p><strong>Finalidad:</strong> responder su solicitud, enviar información sobre nuestros servicios y gestionar la relación comercial. No vendemos ni cedemos sus datos a terceros con fines comerciales.</p>
      <p><strong>Sus derechos:</strong> conocer, actualizar, rectificar y suprimir sus datos, revocar la autorización y presentar quejas ante la Superintendencia de Industria y Comercio. Puede ejercerlos escribiendo a {SITE.email}.</p>
      <p><strong>Conservación:</strong> mientras sea necesario para la finalidad descrita o lo exija la ley.</p>
    </article>
  );
}
