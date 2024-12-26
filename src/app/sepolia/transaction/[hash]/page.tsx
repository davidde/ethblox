import { createAlchemy } from '@/lib/utilities';
import TransactionPage from '@/components/content/transaction-page';


const network = 'sepolia'
const alchemy = createAlchemy(network);

export default async function Page({params} : {params: Promise<{hash: string}>})
{
  const hash = (await params).hash;

  return (
    <TransactionPage
      hash={hash}
      network={network}
      alchemy={alchemy}
    />
  );
}
