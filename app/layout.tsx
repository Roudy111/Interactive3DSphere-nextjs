import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'XR Portfolio',
  description: 'Interactive portfolio showcasing XR development and design projects',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1a1a1a',
  openGraph: {
    title: 'XR Portfolio',
    description: 'Interactive portfolio showcasing XR development and design projects',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
