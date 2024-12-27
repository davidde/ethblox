import { createAlchemy } from '@/lib/utilities';
import HomePage from '@/components/content/home-page';


export default async function Page({params} : {params: Promise<{network: string}>}) {
  const network = (await params).network;
  const alchemy = createAlchemy(network);

  return (
    <HomePage
      network={network}
      alchemy={alchemy}
    />
  );
}
