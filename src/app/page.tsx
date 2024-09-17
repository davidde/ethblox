'use client';

import { useEffect, useState, useContext } from 'react';
import AlchemyContext from "@/components/providers/alchemy-context";
import { GlobeAltIcon, Square3Stack3DIcon, ClockIcon, CubeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Search from '@/components/main/search';


export default function Home() {
  const { alchemy } = useContext(AlchemyContext);

  const [ethPrice, setEthPrice] = useState<{eur: string, usd: string}>();
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
    function getPrice() {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd')
        .then(response => response.json())
        .then(data => {
          if (!ignore) setEthPrice(data.ethereum)
        })
        .catch(error => {
          console.error('getPrice() Error: ', error.message);
        });
    }

    getPrice();
    getBlockNumber();

    // Return cleanup function to ensure that a fetch that’s not
    // relevant anymore does not keep affecting the application:
    return () => { ignore = true; };
  }, [alchemy]);

  return (
    <main className='flex flex-col min-h-screen p-2 md:p-8'>
      <Search />

      <div className={`flex flex-col md:flex-row items-center justify-between
                       border-2 border-[var(--border-color)]
                       rounded-lg w-full md:w-[90%] p-1 md:p-3 my-8 md:my-16`}>
        <div>
          <div className='flex mb-4'>
            <div>
              <div className={`w-8 h-8 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center`} />
            </div>
            <div className='ml-4'>
              <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER PRICE</p>
              <p>{ ethPrice ? `€${ethPrice.eur} / $${ethPrice.usd}` : '' }</p>
            </div>
          </div>
          <div className='flex mb-4'>
            <div>
              <GlobeAltIcon className='w-8 h-8' />
            </div>
            <div className='ml-4'>
              <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>MARKET CAP</p>
              <p>{  }</p>
            </div>
          </div>
        </div>

        <div>
          <div className='flex mb-4'>
            <div>
              <Square3Stack3DIcon className='w-8 h-8' />
            </div>
            <div className='ml-4'>
              <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>TRANSACTIONS</p>
              <p>{  }</p>
            </div>
          </div>
          <div className='flex mb-4'>
            <div>
              <DocumentTextIcon className='w-8 h-8' />
            </div>
            <div className='ml-4'>
              <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>MED GAS PRICE</p>
              <p>{  }</p>
            </div>
          </div>
        </div>

        <div>
          <div className='flex mb-4'>
            <div>
              <ClockIcon className='w-8 h-8' />
            </div>
            <div className='ml-4'>
              <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>LAST FINALIZED BLOCK</p>
              <p>{  }</p>
            </div>
          </div>
          <div className='flex mb-4'>
            <div>
              <CubeIcon className='w-8 h-8' />
            </div>
            <div className='ml-4'>
              <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>LAST SAFE BLOCK</p>
              <p>{  }</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row justify-between w-full`}>
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
