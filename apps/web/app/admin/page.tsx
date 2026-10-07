import type { Metadata } from 'next';
import AdminForm from '@/components/AdminForm';

export const metadata: Metadata = { title: 'Administración', robots: { index: false, follow: false } };

export default function Page() {
  return (
    <div className="wrap section">
      <p className="eyebrow">Administración</p>
      <h1 className="h2 mt-3">Actualizar indicadores manuales</h1>
      <p className="mt-3 max-w-2xl text-sm text-silver-300">IPC, inflación, tasas, IVA, UVT y salario mínimo se actualizan aquí cuando la fuente oficial publica un nuevo dato. Necesitas el token configurado en Railway (ADMIN_TOKEN).</p>
      <div className="mt-8"><AdminForm /></div>
    </div>
  );
}
