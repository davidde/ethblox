'use client';

// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import Searchbar from '@/components/common/searchbar';
import Blocks from './blocks';
import Transactions from './transactions';
import Stats from './stats';
import NodeBanner from './node-banner';
import { useAlchemy } from '@/lib/utilities';
import { useDataState } from '@/lib/data-state';


export default function HomePage(props: {network: string}) {
  const alchemy = useAlchemy(props.network);
  const latestBlock = useDataState({
    // fetcher gets frozen to its initialization state by `useRef(fetcher).current`
    // inside useDataState(), so it requires the alchemy object passed as argument,
    // instead of closing over it! If not passed as argument, things will work fine initially,
    // but never update to Sepolia on network change!
    fetcher: (alchemy) => alchemy.core.getBlockNumber(),
    args: [alchemy],
  });

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
          />

          <Transactions
            network={props.network}
            latestBlockData={latestBlock}
          />
        </div>
      </div>
    </main>
  );
}