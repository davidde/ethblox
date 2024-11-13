import { createAlchemy } from '@/lib/utilities';
import Main from '@/components/main';


const alchemy = createAlchemy('mainnet');

export default async function Page() {
  const network = 'Ethereum Mainnet';
  let blockNumber;

  try {
    blockNumber = await alchemy.core.getBlockNumber();
  } catch(error) {
    console.error('getBlockNumber() Error: ', error);
  }

  return (
    <Main
      blockNumber={blockNumber}
      network={network}
      alchemy={alchemy}
    />
  );
}
