import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { Viewport } from 'next';
import Providers from './providers';
import Header from '@/components/header';
import Footer from '@/components/footer';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EthBlox',
  description: 'The Ethereum Blockchain Explorer',
};

export const viewport: Viewport = {
  height: 'device-height',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      { /* body CSS see globals.css stylesheet! */ }
      <body className={`${inter.className}`} >
        <Providers>
          <Header />
          {props.children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
