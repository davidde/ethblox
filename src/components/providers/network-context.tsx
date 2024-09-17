import { createContext } from 'react';


const NetworkContext = createContext<{
  network: string,
  setNetwork: (network: string) => void
}>({
  network: '',
  setNetwork: () => {}
});

export default NetworkContext;