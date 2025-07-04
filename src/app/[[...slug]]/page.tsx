import { createAlchemy, sanitizeData } from '@/lib/utilities';
import NotFoundPage from '@/components/content/error-page/not-found-page';
import HomePage from '@/components/content/home-page';
import AddressPage from '@/components/content/address-page';
import BlockPage from '@/components/content/block-page';
import GastrackerPage from '@/components/content/gastracker-page';
import TransactionPage from '@/components/content/transaction-page';
import { Suspense } from 'react';


const networks = ['mainnet', 'sepolia'];

// Returns a list of `params` to populate the `[[...slug]]` dynamic segment
// for the static site generation at build time.
// This needs to generate all `pages` below for both networks,
// as well as for the root `/`, which should default to `/mainnet`.
// E.g.: - /, /address, /block, /transaction, /gastracker
//       - /mainnet, /mainnet/address, /mainnet/block, /mainnet/transaction, /mainnet/gastracker
//       - /sepolia, /sepolia/address, /sepolia/block, /sepolia/transaction, ~~/sepolia/gastracker~~
export function generateStaticParams() {
  // The optional catch-all route param `[[...slug]]` is parsed as
  // an array, so paths should match that, and be an array too:
  const paths = [];
  const pages = ['', 'address', 'block', 'gastracker', 'transaction'];

  // Add root page separately to render `/`:
  // (When slug is undefined, Next.js will generate the
  // static root path `/`, which will render `/mainnet`)
  paths.push({ slug: undefined });

  for (const network of networks) {
    for (const page of pages) {
      if (page === '') {
        paths.push({ slug: [network] }); // e.g. /mainnet, /sepolia
      } else {
        paths.push({ slug: [network, page] }); // e.g. /mainnet/gastracker, etc.
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

  // Dispatching:
  switch (subroute) {
    case '':
      return (
        <HomePage
          network={network}
          alchemy={createAlchemy(network)}
        />
      );
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
      if (network !== 'mainnet') {
        return <NotFoundPage reason={`There only exists a Gas Tracker for Ethereum Mainnet.`} />;
      }
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
