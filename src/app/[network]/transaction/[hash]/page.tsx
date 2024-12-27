import { createAlchemy } from '@/lib/utilities';
import TransactionPage from '@/components/content/transaction-page';
import ErrorPage from '@/components/content/error-page';


export default async function Page({params} : {params: Promise<{network: string, hash: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <ErrorPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }
  const hash = (await params).hash;

  return (
    <TransactionPage
      hash={hash}
      network={network}
      alchemy={createAlchemy(network)}
    />
  );
}
