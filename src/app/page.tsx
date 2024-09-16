'use client';

// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState, useContext } from 'react';
import { NetworkContext } from "@/components/context-provider";
import { Input, Field, Label } from '@headlessui/react';
import { GlobeAltIcon, Square3Stack3DIcon, ClockIcon, CubeIcon, DocumentTextIcon } from "@heroicons/react/24/outline";


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

  const [ethPrice, setEthPrice] = useState<{euro: string, usd: string}>();
  const [blockNumber, setBlockNumber] = useState<Number>();

  useEffect(() => {
    let ignore = false;

    async function getBlockNumber() {
      try {
        const blocknumber = await alchemy.core.getBlockNumber();

        if (!ignore) {
          setBlockNumber(blocknumber);
        }
      } catch (error) {
        // console.log('getBlockNumber Error: ', error);
      }
    }
    async function getPrice() {
      let request = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
      let response = await request.json();
      let euro = response.ethereum.eur;
      let usd = response.ethereum.usd;
      if (!ignore) setEthPrice({ euro, usd });
    }

    getPrice();
    // getBlockNumber();

    return () => {   // Cleanup function to ensure that a fetch that’s not relevant
      ignore = true; // anymore does not keep affecting the application
    };
  });

  return (
    <main className='flex flex-col min-h-screen p-2 md:p-8'>
      <div className={`w-full md:w-[40rem]`}>
        <h1 className={`text-xl md:text-2xl font-semibold`}>The Ethereum Blockchain Explorer</h1>
        <Field className={`mt-3`}>
          <Label>Search by Address</Label>
          <Input
            name="search_address"
            type="text"
            className={`block w-full rounded-lg py-1.5
                       bg-[var(--main-bg-color)]
                       border-2 border-[var(--border-color)]`}
          />
        </Field>
        <span className={`ml-2 md:ml-8 text-sm font-light`}>
          Network: { network }
        </span>
      </div>

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
              <p>{ ethPrice ? `€${ethPrice.euro} / $${ethPrice.usd}` : '' }</p>
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
          <p>Block Number: { `${blockNumber}` }</p>
        </div>
        <div className={`border-2 border-[var(--border-color)]
                        rounded-lg w-full md:w-[45%] p-1 md:p-3 mb-2`}>
          <h2>Latest Transactions</h2>
        </div>
      </div>
    </main>
  );
}
