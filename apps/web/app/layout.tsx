import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsApp from '@/components/WhatsApp';
import { SITE } from '@/lib/content';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: 'Integral Consulting SAS. | Consultoría estratégica, aseguramiento y control', template: '%s | Integral Consulting SAS.' },
  description: 'Consultoría contable y financiera, auditoría, revisoría fiscal, asesoría tributaria y control interno. Más de 20 años de experiencia en Colombia, con alcance internacional. Indicadores económicos al día.',
  openGraph: { type: 'website', locale: 'es_CO', siteName: 'Integral Consulting SAS.', images: ['/og.png'] },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = { themeColor: '#04142E' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'Integral Consulting SAS.',
    url: SITE.url, email: SITE.email, telephone: SITE.phone, areaServed: 'CO', logo: `${SITE.url}/logo.png`,
    description: 'Consultoría estratégica, aseguramiento y control fiscal.',
  };
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-gold-500 focus:p-3 focus:text-navy-950">Saltar al contenido</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <WhatsApp />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      </body>
    </html>
  );
}
