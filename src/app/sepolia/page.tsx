import { createAlchemy } from '@/lib/utilities';
import Main from '@/components/main';


const alchemy = createAlchemy('sepolia');

export default async function Page() {
  const network = 'Testnet Sepolia';
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
