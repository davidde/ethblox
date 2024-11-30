// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy } from 'alchemy-sdk';
import Searchbar from '@/components/header/searchbar';
import Blocks from './blocks';
import Transactions from './transactions';
import Stats from './stats';


type Props = {
  blockNumber: number | undefined,
  network: string,
  alchemy: Alchemy
}

export default function HomePage(props: Props) {
  return (
    <main className='flex flex-col min-h-screen p-2 md:p-8'>
      <div className='w-full md:w-[40rem] mb-4 md:mb-8'>
        <h1 className='text-xl md:text-2xl font-semibold mb-3'>
          {
            props.network === 'Ethereum Mainnet' ?
                      'The Ethereum Blockchain Explorer' :
                      'The Sepolia Testnet Explorer'
          }
        </h1>
        <Searchbar />
        <span className='ml-2 md:ml-8 text-sm font-light'>
          Network: { props.network }
        </span>
      </div>

      {
        props.network === 'Ethereum Mainnet' ?
        <Stats /> : ''
      }

      <div className='flex flex-col md:flex-row flex-wrap items-center md:items-start w-full'>
        <Blocks
          blockNumber={props.blockNumber}
          network={props.network}
          alchemy={props.alchemy}
        />
        <Transactions
          blockNumber={props.blockNumber}
          network={props.network}
          alchemy={props.alchemy}
        />
      </div>
    </main>
  );
}