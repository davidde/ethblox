import { createAlchemy } from '@/lib/utilities';
import AddressPage from '@/components/content/address-page';
import ErrorPage from '@/components/content/error-page';


export default async function Page({params} : {params: Promise<{network: string, hash: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <ErrorPage reason={`"${network}" is not a valid Ethereum network.`} />;
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
