'use client';

import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import NetworkContext from './network-context';


type Props = {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  const [network, setNetwork] = useState('Ethereum Mainnet');

  return (
    <>
      <ThemeProvider>
        <NetworkContext.Provider value={{network, setNetwork}}>
          {children}
        </NetworkContext.Provider>
      </ThemeProvider>
    </>
  );
}