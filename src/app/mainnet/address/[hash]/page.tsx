import { createAlchemy } from '@/lib/utilities';
import Address from '@/components/address';


const network = 'mainnet'
const alchemy = createAlchemy(network);

export default async function Page({params} : {params: Promise<{hash: string}>})
{
  const hash = (await params).hash;

  return (
    <Address
      hash={hash}
      network={network}
      alchemy={alchemy}
    />
  );
}
