'use client';

// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import Search from '@/components/main/search';

const alchemy = new Alchemy({
  // You should never expose your API key like this in production level code!
  // See https://docs.alchemy.com/docs/best-practices-for-key-security-and-management,
  // and https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests.
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
});

export default function Main() {
  const [blockNumber, setBlockNumber] = useState<Number>();

  useEffect(() => {
    let ignore = false;

    function getBlockNumber() {
      alchemy.core.getBlockNumber()
        .then(num => {
          if (!ignore) setBlockNumber(num)
        })
        .catch(error => {
          console.log('getBlockNumber() Error: ', error.message);
        });
    }

    getBlockNumber();

    // Return cleanup function to ensure that a fetch that’s not
    // relevant anymore does not keep affecting the application:
    return () => { ignore = true; };
  }, []);

  return (
    <main className='flex flex-col min-h-screen p-2 md:p-8'>
      <Search network='Testnet Sepolia' />

      <div className={`flex flex-col md:flex-row justify-between w-full mt-8 md:mt-16`}>
        <div className={`border-2 border-[var(--border-color)]
                        rounded-lg w-full md:w-[50%] p-1 md:p-3 mb-2`}>
          <h2>Latest Blocks</h2>
          <p>Block Number: { blockNumber ? `${blockNumber}` : '' }</p>
        </div>
        <div className={`border-2 border-[var(--border-color)]
                        rounded-lg w-full md:w-[45%] p-1 md:p-3 mb-2`}>
          <h2>Latest Transactions</h2>
        </div>
      </div>
    </main>
  );
}
