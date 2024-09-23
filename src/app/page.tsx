// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network } from 'alchemy-sdk';
import Search from '@/components/main/search';
import Blocks from '@/components/main/blocks';
import Transactions from '@/components/main/transactions';
import Stats from '@/components/main/stats';


const alchemy = new Alchemy({
  // You should never expose your API key like this in production level code!
  // See https://docs.alchemy.com/docs/best-practices-for-key-security-and-management,
  // and https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests.
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
  connectionInfoOverrides: {
    skipFetchSetup: true,
  },
});

export default async function Main() {
  const network = 'Ethereum Mainnet';
  let blockNumber;

  try {
    blockNumber = await alchemy.core.getBlockNumber();
  } catch(error) {
    console.error('getBlockNumber() Error: ', error);
  }

  return (
    <main className='flex flex-col min-h-screen p-2 md:p-8'>
      <Search network={network} />

      <Stats />

      <div className={`flex flex-col md:flex-row justify-between w-full`}>
        <Blocks
          blockNumber={blockNumber}
          network={network}
          alchemy={alchemy}
        />
        <Transactions
          blockNumber={blockNumber}
          network={network}
          alchemy={alchemy}
        />
      </div>
    </main>
  );
}
