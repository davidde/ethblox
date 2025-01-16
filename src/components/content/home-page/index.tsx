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
    <main className='flex flex-col min-h-screen'>
      <NodeBanner className='mb-4 md:mb-8'>
        <h1 className='text-xl md:text-2xl font-semibold mb-3'>
          {
            props.network === 'mainnet' ?
                      'The Ethereum Blockchain Explorer' :
                      'The Sepolia Testnet Explorer'
          }
        </h1>
        <Searchbar />
        <span className='ml-2 md:ml-8 text-sm font-light'>
          Network: { props.network === 'mainnet' ?
                      'Ethereum Mainnet' :
                      'Testnet Sepolia' }
        </span>
      </NodeBanner>

      {
        props.network === 'mainnet' ?
        <Stats /> : ''
      }

      <div className='flex flex-col md:flex-row flex-wrap items-center md:items-start w-full'>
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
    </main>
  );
}