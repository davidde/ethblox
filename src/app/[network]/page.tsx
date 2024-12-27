import { createAlchemy } from '@/lib/utilities';
import HomePage from '@/components/content/home-page';
import ErrorPage from '@/components/content/error-page';


export default async function Page({params} : {params: Promise<{network: string}>}) {
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <ErrorPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }

  return (
    <HomePage
      network={network}
      alchemy={createAlchemy(network)}
    />
  );
}
