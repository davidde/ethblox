import { createAlchemy } from '@/lib/utilities';
import BlockPage from '@/components/content/block-page';
import NotFoundPage from '@/components/content/error-page/not-found-page';


export default async function Page({params} : {params: Promise<{network: string, number: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <NotFoundPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }
  const number = (await params).number;

  return (
    <BlockPage
      number={+number}
      network={network}
      alchemy={createAlchemy(network)}
    />
  );
}
