import { createAlchemy } from '@/lib/utilities';
import AddressPage from '@/components/content/address-page';
import NotFoundPage from '@/components/content/error-page/not-found-page';


export default async function Page({params} : {params: Promise<{network: string, hash: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <NotFoundPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }
  const hash = (await params).hash;

  return (
    <AddressPage
      hash={hash}
      network={network}
      alchemy={createAlchemy(network)}
    />
  );
}
