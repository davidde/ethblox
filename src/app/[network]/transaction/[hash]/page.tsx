import { createAlchemy } from '@/lib/utilities';
import TransactionPage from '@/components/content/transaction-page';
import NotFoundPage from '@/components/content/error-page/not-found-page';


export async function generateStaticParams() {
  return [
    { network: 'mainnet', hash: '0xd921ed22ca432ced11f64bef5a959309d2e7c026e65025b71b91139483c11c66' },
    { network: 'mainnet', hash: '0xa8633cf37391af72bd8c3b06361e5b749c229514d4b30a9577a7f42bbd73be09' },
    { network: 'sepolia', hash: '0x0bfd4282f5ba5fe2b86951f68f4e5f8c8329b97daaaf8281948b5aa84ef93f01' },
    { network: 'sepolia', hash: '0x8c8e64e75fc8ba50c5b9955d85bc8138cc6677fb1f7b20299d55d1833c3dccf5' },
  ];
}

export default async function Page({params,} : {params: Promise<{network: string; hash: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet' && network !== 'sepolia') {
    return <NotFoundPage reason={`"${network}" is not a valid Ethereum network.`} />;
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
