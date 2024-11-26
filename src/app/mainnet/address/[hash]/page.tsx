import { createAlchemy } from '@/lib/utilities';
import { Utils } from 'alchemy-sdk';
import Tokens from '@/components/address/tokens';


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

  // let transfers = await alchemy.core.getAssetTransfers({
  //   toAddress: hash,
  //   excludeZeroValue: true,
  //   category: [ AssetTransfersCategory.ERC20 ],
  // })

  // console.log("transfers = ", transfers);

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
            network='mainnet'
            alchemy={alchemy}
          />
      }
    </div>
  );
}
