import { createAlchemy } from '@/lib/utilities';
import AddressPage from '@/components/content/address-page';


const network = 'mainnet'
const alchemy = createAlchemy(network);

export default async function Page({params} : {params: Promise<{hash: string}>})
{
  const hash = (await params).hash;

  return (
    <AddressPage
      hash={hash}
      network={network}
      alchemy={alchemy}
    />
  );
}
