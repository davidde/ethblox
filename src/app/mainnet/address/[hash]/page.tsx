import { createAlchemy } from '@/lib/utilities';
import { Utils } from 'alchemy-sdk';


const alchemy = createAlchemy('mainnet');

export default async function Page({ params } :
  { params: Promise<{ hash: string }> })
{
  const hash = (await params).hash;
  let ethBalance, valueEur, valueUsd, realTokens, badAddress;

  try {
    ethBalance = Utils.formatEther(await alchemy.core.getBalance(hash, 'latest'));
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
    const data = await response.json();
    valueEur = (+ethBalance * data.ethereum.eur).toLocaleString('en-US',
      {
        style: 'currency',
        currency: 'EUR',
      });
    valueUsd = (+ethBalance * data.ethereum.usd).toLocaleString('en-US',
      {
        style: 'currency',
        currency: 'USD',
      });

    const tokens = await alchemy.core.getTokensForOwner(hash);
    // Remove tokens with zero balance or undefined logo or symbol:
    realTokens = tokens.tokens.filter((token) => {
      return token.balance !== "0.0" && token.logo !== undefined && token.symbol !== undefined;
    });
    // Sort tokens alphabetically by symbol:
    realTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
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
          <div>
            <div className='m-4'>
              <h2 className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETH BALANCE</h2>
              Ξ{ethBalance}
            </div>
            <div className='m-4'>
              <h2 className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETH VALUE</h2>
              <p>{valueEur}</p>
              <p>{valueUsd}</p>
            </div>
            <div className='m-4'>
              <h2 className='text-xs tracking-wider text-[var(--grey-fg-color)]'>TOKEN HOLDINGS</h2>
              <ul>
                {
                  realTokens!.map((token, i) =>
                  <li key={i}>
                    {token.name}: {token.balance} {token.symbol}
                  </li>)
                }
              </ul>
            </div>
          </div>
      }
    </div>
  );
}
