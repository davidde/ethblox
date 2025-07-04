import { createAlchemy, sanitizeData } from '@/lib/utilities';
import TransactionPage from '@/components/content/transaction-page';
import NotFoundPage from '@/components/content/error-page/not-found-page';
import { Suspense } from 'react';


// Return a list of `params` to populate the [network] dynamic segment:
export function generateStaticParams() {
   return [{ network: 'mainnet' }, { network: 'sepolia' }];
}

export default async function Page({params} : {params: Promise<{network: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <NotFoundPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }

  return (
    // Suspense required because of `useSearchParams` in `TransactionPage`:
    <Suspense>
      <TransactionPage
        network={network}
        alchemy={await sanitizeData(createAlchemy(network))}
      />
    </Suspense>
  );
}
