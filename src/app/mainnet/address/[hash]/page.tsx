import { createAlchemy } from '@/lib/utilities';
import { Utils } from 'alchemy-sdk';
import Tokens from '@/components/address/tokens';
import Transactions from '@/components/address/transactions';


const alchemy = createAlchemy('mainnet');

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
        <p className="text-lg font-bold">
          Address:
        </p>
        {hash}
      </div>
      {
        badAddress ?
          <div className='m-4'>This address does not exist.</div>
          :
          <div className='flex flex-col md:flex-row flex-wrap'>
            <Tokens
              hash={hash}
              ethBalance={ethBalance!}
              network='mainnet'
              alchemy={alchemy}
            />
            <Transactions
              hash={hash}
              network='mainnet'
              alchemy={alchemy}
            />
          </div>
      }
    </div>
  );
}
