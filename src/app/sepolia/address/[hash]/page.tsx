import { createAlchemy } from '@/lib/utilities';
import { Utils } from 'alchemy-sdk';
import Tokens from '@/components/address/tokens';
import Transactions from '@/components/address/transactions';


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
        <p className='text-lg font-bold'>
          Address:
        </p>
        <p className='max-w-[90vw] break-words'>
          {hash}
        </p>
      </div>
      {
        badAddress ?
          <div className='m-4'>This address does not exist.</div>
          :
          <div className='flex flex-col'>
            <Tokens
              hash={hash}
              ethBalance={ethBalance!}
              network='sepolia'
              alchemy={alchemy}
            />
            <Transactions
              hash={hash}
              network='sepolia'
              alchemy={alchemy}
            />
          </div>
      }
    </div>
  );
}