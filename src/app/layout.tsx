import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ThemeProvider } from 'next-themes';
import type { Viewport } from 'next';


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--main-bg-color)] text-[var(--main-fg-color)]`} >
        <ThemeProvider attribute="class">
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
