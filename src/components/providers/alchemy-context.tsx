import { createContext } from 'react';
import { Alchemy } from 'alchemy-sdk';


const AlchemyContext = createContext<{
  alchemy: Alchemy,
  setAlchemy: (alchemy: Alchemy) => void
}>({
  alchemy: new Alchemy,
  setAlchemy: () => {}
});

export default AlchemyContext;