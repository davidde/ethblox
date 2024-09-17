import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";


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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--main-bg-color)] text-[var(--main-fg-color)]`} >
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
