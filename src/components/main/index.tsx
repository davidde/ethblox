// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy } from 'alchemy-sdk';
import Search from '@/components/main/search';
import Blocks from '@/components/main/blocks';
import Transactions from '@/components/main/transactions';
import Stats from '@/components/main/stats';


type Props = {
  blockNumber: number | undefined,
  network: string,
  alchemy: Alchemy
}

export default function Main(props: Props) {
  return (
    <main className='flex flex-col min-h-screen p-2 md:p-8'>
      <Search network={props.network} />

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