import { createAlchemy } from '@/lib/utilities';


const alchemy = createAlchemy('sepolia');

export default async function Page({ params } :
  { params: Promise<{ hash: string }> })
{
  const hash = (await params).hash;
  // Todo: Fill in data with:
  //       - https://docs.alchemy.com/reference/gettokensforowner-sdk
  //       - https://docs.alchemy.com/reference/sdk-getassettransfers

  return (
    <div>
      Address: {hash}
    </div>
  );
}
