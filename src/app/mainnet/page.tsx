import { createAlchemy } from '@/lib/utilities';
import HomePage from '@/components/content/home-page';


const network = 'mainnet';
const alchemy = createAlchemy(network);

export default async function Page() {
  return (
    <HomePage
      network={network}
      alchemy={alchemy}
    />
  );
}
