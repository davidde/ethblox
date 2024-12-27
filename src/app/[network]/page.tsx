import { createAlchemy } from '@/lib/utilities';
import HomePage from '@/components/content/home-page';
import NotFoundPage from '@/components/content/error-page/not-found-page';


export default async function Page({params} : {params: Promise<{network: string}>}) {
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <NotFoundPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }

  return (
    <HomePage
      network={network}
      alchemy={createAlchemy(network)}
    />
  );
}
