'use client';

import { ThemeProvider } from 'next-themes';
import { NetworkProvider } from '@/components/common/network-context';


export default function Providers(props: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider attribute='class'>
        <NetworkProvider>
          {props.children}
        </NetworkProvider>
      </ThemeProvider>
    </>
  );
}
