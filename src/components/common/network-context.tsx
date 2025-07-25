import { createContext, useContext, ReactNode } from 'react';
import { NetworkType } from '@/lib/utilities';
import { usePathname } from 'next/navigation';


function useNetworkFromPath(): NetworkType {
  const pathname = usePathname();
  return pathname.startsWith('/sepolia') ? 'sepolia' : 'mainnet';
}

type NetworkContextType = {
  network: NetworkType;
};

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider(props: { children: ReactNode }) {
  const network = useNetworkFromPath();

  return (
    <NetworkContext.Provider value={{ network }}>
      {props.children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('`useNetwork()` must always be called inside a NetworkProvider');
  }
  return context;
}
