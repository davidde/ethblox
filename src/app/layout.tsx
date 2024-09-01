import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blockexplorer",
  description: "Ethereum Blockexplorer with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorClass = 'bg-white dark:bg-black dark:text-white';
  const borderClass = 'border-b border-slate-200 dark:border-stone-900';

  return (
    <html lang="en">
      <body className={`${inter.className} ${colorClass}`} >
        <Navbar colorClass={colorClass} borderClass={borderClass} />
        {children}
      </body>
    </html>
  );
}
