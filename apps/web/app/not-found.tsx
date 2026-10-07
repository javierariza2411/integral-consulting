import Link from 'next/link';
export default function NotFound() {
  return <div className="wrap section text-center"><p className="eyebrow">Error 404</p><h1 className="h2 mt-3">No encontramos esa página</h1><Link href="/" className="btn-gold mt-8">Volver al inicio</Link></div>;
}
