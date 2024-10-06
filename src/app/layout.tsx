import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from 'next-themes';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EthBlox",
  description: "The Ethereum Blockchain Explorer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--main-bg-color)] text-[var(--main-fg-color)]`} >
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
