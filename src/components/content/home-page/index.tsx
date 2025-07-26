'use client';

// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { useCallback, useEffect, useState } from 'react';
import Searchbar from '@/components/common/searchbar';
import Blocks from './blocks';
import Transactions from './transactions';
import Stats from './stats';
import NodeBanner from './node-banner';
import { getAlchemy } from '@/lib/utilities';
import DataState from '@/lib/data-state';


export default function HomePage(props: {network: string}) {
  const alchemy = getAlchemy(props.network);
  const [latestBlock, setLatestBlock] = useState(DataState.value<number>());

  const getLatestBlock = useCallback(async () => {
    try {
      const resp = await alchemy.core.getBlockNumber();
      setLatestBlock(DataState.value(resp));
    } catch(err) {
      setLatestBlock(DataState.error(err));
    }
  }, [alchemy]);

  useEffect(() => {
    getLatestBlock();
  }, [getLatestBlock]);

  return (
    <main className='relative'>
      <NodeBanner />

      <div className='absolute top-10 md:top-20 left-0 md:left-60' >
        <h1 className='bg-clip-text text-transparent bg-linear-to-r
          from-(--gradient-from-color) via-(--gradient-via-color) to-(--gradient-to-color)
          text-4xl md:text-5xl font-bold md:mb-8 p-2 md:p-0 ml-2 text-pretty'>
          { props.network === 'mainnet' ?
                'The Ethereum Blockchain Explorer' : 'The Sepolia Testnet Explorer' }
        </h1>

        <Searchbar className='w-full md:w-[50vw] md:mb-2 p-2 md:p-0' />

        <span className='ml-2 md:ml-8 text-base font-light text-(--grey-fg-color) p-2 md:p-0'>
          Network: { props.network === 'mainnet' ?
                      'Ethereum Mainnet' : 'Testnet Sepolia' }
        </span>
      </div>

      {/* Actual DATA fetching components: */}
      <div className='relative -mt-20 md:-mt-[8.2rem] p-2 md:pl-12 md:pr-0'>
        <div className='flex flex-col md:flex-row flex-wrap items-center md:items-start justify-center w-full'>
          { props.network === 'mainnet' ? <Stats /> : '' }
          <div className='basis-full h-0' /> {/* Break the following flex item to a new row */}

          <Blocks
            network={props.network}
            latestBlockData={latestBlock}
            refetch={getLatestBlock}
          />

          <Transactions
            network={props.network}
            latestBlockData={latestBlock}
            refetch={getLatestBlock}
          />
        </div>
      </div>
    </main>
  );
}