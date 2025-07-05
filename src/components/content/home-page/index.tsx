// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy } from 'alchemy-sdk';
import Searchbar from '@/components/common/searchbar';
import Blocks from './blocks';
import BlocksSkeleton from './blocks/blocks-skeleton';
import Transactions from './transactions';
import TransactionsSkeleton from './transactions/transactions-skeleton';
import Stats from './stats';
import StatsSkeleton from './stats/stats-skeleton';
import NodeBanner from './node-banner';
import { Suspense } from 'react';


type Props = {
  network: string,
  alchemy: Alchemy
}

export default async function HomePage(props: Props) {
  let blockNumber;

  try {
    blockNumber = await props.alchemy.core.getBlockNumber();
  } catch(error) {
    console.error('getBlockNumber()', error);
  }

  return (
    <main className='relative'>
      <NodeBanner className='relative top-0 left-0' />

      <div className='absolute top-10 md:top-20 left-0 md:left-60' >
        <h1 className='bg-gradient-to-r from-[--gradient-from-color] via-[--gradient-via-color] to-[--gradient-to-color]
                       bg-clip-text text-transparent text-4xl md:text-5xl font-bold md:mb-8 p-2 md:p-0 ml-2 text-pretty'>
          {
            props.network === 'mainnet' ?
                      'The Ethereum Blockchain Explorer' :
                      'The Sepolia Testnet Explorer'
          }
        </h1>

        <Searchbar className='w-full md:w-[50vw] md:mb-2 p-2 md:p-0' />

        <span className='ml-2 md:ml-8 text-base font-light text-[--grey-fg-color] p-2 md:p-0'>
          Network: { props.network === 'mainnet' ?
                      'Ethereum Mainnet' :
                      'Testnet Sepolia' }
        </span>
      </div>

      <div className='relative -mt-[5rem] md:-mt-[8.2rem] p-2 md:pl-12 md:pr-0'>
        <div className='flex flex-col md:flex-row flex-wrap items-center md:items-start justify-center w-full'>
          {
            props.network === 'mainnet' ?
              <>
                <Suspense fallback={<StatsSkeleton />}>
                  <Stats />
                </Suspense>
                <div className='basis-full h-0' /> {/* Break the following flex item to a new row */}
              </> : ''
          }
          <Suspense fallback={<BlocksSkeleton />}>
            <Blocks
              blockNumber={blockNumber}
              network={props.network}
              alchemy={props.alchemy}
            />
          </Suspense>
          <Suspense fallback={<TransactionsSkeleton />}>
            <Transactions
              blockNumber={blockNumber}
              network={props.network}
              alchemy={props.alchemy}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}