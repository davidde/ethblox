import { createAlchemy } from '@/lib/utilities';
import AddressPage from '@/components/content/address-page';
import NotFoundPage from '@/components/content/error-page/not-found-page';


export async function generateStaticParams() {
  return [
    { network: 'mainnet', hash: '0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97' },
    { network: 'mainnet', hash: '0x6bE457e04092B28865E0cBa84E3b2CFa0f871E67' },
    { network: 'sepolia', hash: '0xC0f3833B7e7216EEcD9f6bC2c7927A7aA36Ab58B' },
    { network: 'sepolia', hash: '0xdf5Cdb9c90eA2791d3AC840eAA582dF01C22Ca22' },
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
    <AddressPage
      hash={hash}
      network={network}
      alchemy={createAlchemy(network)}
    />
  );
}
