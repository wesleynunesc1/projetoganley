import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'PROJETO GANLEY — Plataforma Exclusiva de Treinamento',
  description: 'Biblioteca exclusiva de programas de treinamento físico de alto padrão.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'PROJETO GANLEY',
    description: 'Treine com propósito. Evolua com método.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-ganley-black text-white antialiased min-h-screen selection:bg-ganley-purple selection:text-white">
        {children}
      </body>
    </html>
  );
}
