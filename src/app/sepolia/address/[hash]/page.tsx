import { createAlchemy } from '@/lib/utilities';
import { Utils } from 'alchemy-sdk';
import Tokens from '@/components/address/tokens';


const alchemy = createAlchemy('sepolia');

export default async function Page({ params } :
  { params: Promise<{ hash: string }> })
{
  const hash = (await params).hash;
  let ethBalance, badAddress;

  try {
    ethBalance = Utils.formatEther(await alchemy.core.getBalance(hash, 'latest'));
    badAddress = false;
  } catch {
    badAddress = true;
  }

  return (
    <div>
      <div className='m-4'>
        <b>Address:</b> {hash}
      </div>
      {
        badAddress ?
          <div className='m-4'>This address does not exist.</div>
          :
          <Tokens
            hash={hash}
            ethBalance={ethBalance!}
            network='sepolia'
            alchemy={alchemy}
          />
      }
    </div>
  );
}