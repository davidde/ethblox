'use client';

import { ThemeProvider } from 'next-themes';
import { createContext, useState } from 'react';


type Props = {
  children: React.ReactNode;
}

export const NetworkContext = createContext<{
  network: string,
  setNetwork: (network: string) => void
}>({
  network: '',
  setNetwork: () => {}
});

export default function ContextProvider({ children }: Props) {
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