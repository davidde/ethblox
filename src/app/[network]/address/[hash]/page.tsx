import { createAlchemy } from '@/lib/utilities';
import AddressPage from '@/components/content/address-page';


export default async function Page({params} : {params: Promise<{network: string, hash: string}>})
{
  const network = (await params).network;
  const alchemy = createAlchemy(network);
  const hash = (await params).hash;

  return (
    <AddressPage
      hash={hash}
      network={network}
      alchemy={alchemy}
    />
  );
}
