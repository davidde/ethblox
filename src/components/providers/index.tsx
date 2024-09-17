'use client';

import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import NetworkContext from './network-context';
import AlchemyContext from './alchemy-context';
import { Alchemy, Network } from 'alchemy-sdk';


type Props = {
  children: React.ReactNode;
}

export default function Providers({ children }: Props) {
  const [network, setNetwork] = useState('Ethereum Mainnet');
  const [alchemy, setAlchemy] = useState(
    new Alchemy({
      // You should never expose your API key like this in production level code!
      // See https://docs.alchemy.com/docs/best-practices-for-key-security-and-management,
      // and https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests.
      apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
      network: Network.ETH_MAINNET,
    })
  );

  return (
    <>
      <ThemeProvider>
        <NetworkContext.Provider value={{network, setNetwork}}>
          <AlchemyContext.Provider value={{alchemy, setAlchemy}}>
            {children}
          </AlchemyContext.Provider>
        </NetworkContext.Provider>
      </ThemeProvider>
    </>
  );
}