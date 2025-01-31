import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

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
        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          html,
          body {
            max-width: 100vw;
            overflow-x: hidden;
            background: #1a1a1a;
            color: #ffffff;
          }

          body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: fixed;
            width: 100%;
            height: 100%;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          canvas {
            touch-action: none;
          }
        `}</style>
      </body>
    </html>
  );
}
