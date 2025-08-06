import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pyth Price Feeds Demo | Solana Oracle Integration',
  description: 'Live demonstration of Pyth price feeds integration on Solana with modern pull oracle architecture, security validations, and production-ready patterns.',
  keywords: [
    'Pyth',
    'Solana',
    'Oracle',
    'Price Feeds',
    'DeFi',
    'Blockchain',
    'Real-time Data',
    'Pull Oracle',
    'QuickNode'
  ],
  authors: [{ name: 'QuickNode Technical Writer Candidate' }],
  openGraph: {
    title: 'Pyth Price Feeds Demo | Solana Oracle Integration',
    description: 'Live demonstration of production-ready Pyth price feeds integration on Solana',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pyth Price Feeds Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyth Price Feeds Demo | Solana Oracle Integration',
    description: 'Live demonstration of production-ready Pyth price feeds integration on Solana',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#6C5CE7" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
