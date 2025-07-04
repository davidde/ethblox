import { createAlchemy, sanitizeData } from '@/lib/utilities';
import NotFoundPage from '@/components/content/error-page/not-found-page';
import HomePage from '@/components/content/home-page';
import AddressPage from '@/components/content/address-page';
import BlockPage from '@/components/content/block-page';
import GastrackerPage from '@/components/content/gastracker-page';
import TransactionPage from '@/components/content/transaction-page';
import { Suspense } from 'react';


const networks = ['mainnet', 'sepolia'];
const pages = ['address', 'block', 'gastracker', 'transaction'];

// Return a list of `params` to populate the `[[...slug]]` dynamic segment:
// This needs to generate the above pages for both networks,
// as well as for the root `/`, which should default to `/mainnet`.
export function generateStaticParams() {
  const routes = pages.concat('');

  // The optional catch-all route param `[[...slug]]` is parsed as
  // an array, so paths should match that, and be an array too:
  const paths = [];

  // Add root page separately to render `/`:
  // (When slug is undefined, Next.js will generate the
  // static root path `/`, which will render `/mainnet`)
  paths.push({ slug: undefined });

  for (const network of networks) {
    for (const route of routes) {
      if (route === '') {
        paths.push({ slug: [network] }); // e.g. /mainnet, /sepolia
      } else {
        paths.push({ slug: [network, route] }); // e.g. /mainnet/gastracker, etc.
      }
    }
  }

  return paths;
}

export default async function Page({params} : { params: { slug?: string[] } }) {
  const { slug = [] } = await params;

  const network = slug[0] ?? 'mainnet';
  const subroute = slug[1] ?? '';

  // Validate network:
  if (!networks.includes(network)) {
    return <NotFoundPage reason={`"${network}" is not a valid Ethereum network.`} />;
  }

  // === Dispatch ===
  if (slug.length === 0 || subroute === '') {
    return (
      <HomePage
        network={network}
        alchemy={createAlchemy(network)}
      />
    );
  }

  switch (subroute) {
    case 'address':
      return (
        // Suspense required because of `useSearchParams` in `AddressPage`:
        <Suspense>
          <AddressPage
            network={network}
            alchemy={await sanitizeData(createAlchemy(network))}
          />
        </Suspense>
      );
    case 'block':
      return (
        // Suspense required because of `useSearchParams` in `BlockPage`:
        <Suspense>
          <BlockPage
            network={network}
            alchemy={await sanitizeData(createAlchemy(network))}
          />
        </Suspense>
      );
    case 'gastracker':
      return <GastrackerPage />;
    case 'transaction':
      return (
        // Suspense required because of `useSearchParams` in `TransactionPage`:
        <Suspense>
          <TransactionPage
            network={network}
            alchemy={await sanitizeData(createAlchemy(network))}
          />
        </Suspense>
      );
    default:
      return <NotFoundPage reason={`"${subroute}" is not a valid route.`} />;
  }
}
