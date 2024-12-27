import { createAlchemy } from '@/lib/utilities';
import TransactionPage from '@/components/content/transaction-page';


export default async function Page({params} : {params: Promise<{network: string, hash: string}>})
{
  const network = (await params).network;
  const alchemy = createAlchemy(network);
  const hash = (await params).hash;

  return (
    <TransactionPage
      hash={hash}
      network={network}
      alchemy={alchemy}
    />
  );
}
