// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy } from 'alchemy-sdk';
import Searchbar from '@/components/header/searchbar';
import Blocks from './blocks';
import Transactions from './transactions';
import Stats from './stats';
import NodeBanner from './node-banner';


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
    <main className='relative flex flex-col min-h-screen'>
      <NodeBanner
        className='relative top-0 left-0 mb-4 md:mb-8'
        bgColor='#15172e'
        fgColor='#3f426a'
      />

      <div className='absolute top-10 md:top-20 left-0 md:left-60' >
        <h1 className='ml-2 text-white text-2xl md:text-4xl font-semibold md:mb-8 p-2 md:p-0 text-pretty'>
          {
            props.network === 'mainnet' ?
                      'The Ethereum Blockchain Explorer' :
                      'The Sepolia Testnet Explorer'
          }
        </h1>

        <Searchbar className='w-full md:w-[50vw] md:mb-2 p-2 md:p-0' />

        <span className='ml-2 md:ml-8 text-base font-light text-slate-400 p-2 md:p-0'>
          Network: { props.network === 'mainnet' ?
                      'Ethereum Mainnet' :
                      'Testnet Sepolia' }
        </span>
      </div>

      <div className='relative -top-24 md:-top-[10.2rem] p-2 md:pl-12 md:pr-0'>
        <div className='flex flex-col md:flex-row flex-wrap items-center md:items-start justify-center w-full'>
          {
            props.network === 'mainnet' ?
              <>
                <Stats />
                <div className='basis-full h-0' /> {/* Break the following flex item to a new row */}
              </> : ''
          }
          <Blocks
            blockNumber={blockNumber}
            network={props.network}
            alchemy={props.alchemy}
          />
          <Transactions
            blockNumber={blockNumber}
            network={props.network}
            alchemy={props.alchemy}
          />
        </div>
      </div>
    </main>
  );
}