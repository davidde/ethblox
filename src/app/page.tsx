'use client';

// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState, useContext } from 'react';
import { NetworkContext } from "@/components/context-provider";


const networks = new Map([
  ['Ethereum Mainnet' , Network.ETH_MAINNET],
  ['Testnet Sepolia' , Network.ETH_SEPOLIA] ,
]);

export default function Home() {
  const { network } = useContext(NetworkContext);

  // You should never expose your API key like this in production level code!
  // See https://docs.alchemy.com/docs/best-practices-for-key-security-and-management,
  // and https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests.
  const alchemy = new Alchemy({
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: networks.get(network),
  });

  const [blockNumber, setBlockNumber] = useState<number>();

  useEffect(() => {
    let ignore = false;

    async function getBlockNumber() {
      const blocknumber = await alchemy.core.getBlockNumber();
      if (!ignore) {
        setBlockNumber(blocknumber);
      }
    }

    getBlockNumber();

    return () => {   // Cleanup function to ensure that a fetch that’s not relevant
      ignore = true; // anymore does not keep affecting the application
    };
  });

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>

      <div className={``}>
        Block Number: {blockNumber}
      </div>

    </main>
  );
}
