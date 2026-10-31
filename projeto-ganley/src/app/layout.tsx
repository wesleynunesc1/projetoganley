import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Projeto Ganley — Plataforma de Treinamento',
  description: 'Plataforma exclusiva de treinamentos e evolução física.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Projeto Ganley',
    description: 'Biblioteca completa de treinamentos para cada etapa da sua evolução.',
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
    <html lang="pt-BR" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-ganley-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
