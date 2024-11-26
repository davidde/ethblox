import { Alchemy } from 'alchemy-sdk';


type Props = {
  hash: string,
  ethBalance: string,
  network: string,
  alchemy: Alchemy
}

export default async function Tokens(props: Props) {
  let valueEur, valueUsd, realTokens;

  if (props.network === 'mainnet') {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
    const data = await response.json();
    valueEur = (+props.ethBalance * data.ethereum.eur).toLocaleString('en-US',
      {
        style: 'currency',
        currency: 'EUR',
      });
    valueUsd = (+props.ethBalance * data.ethereum.usd).toLocaleString('en-US',
      {
        style: 'currency',
        currency: 'USD',
      });

    const tokens = await props.alchemy.core.getTokensForOwner(props.hash);
    // Remove tokens with zero balance or undefined logo or symbol:
    realTokens = tokens.tokens.filter((token) => {
      return token.balance !== '0.0' && token.logo !== undefined && token.symbol !== undefined;
    });
    // Sort tokens alphabetically by symbol:
    realTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
  }

  return (
    <div className='pr-12'>
      <div className='m-4'>
        <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>ETH BALANCE</h2>
        Ξ{props.ethBalance}
      </div>
      {
        props.network === 'mainnet' ?
          <div>
            <div className='m-4'>
              <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>ETH VALUE</h2>
              <p>{valueEur}</p>
              <p>{valueUsd}</p>
            </div>

            <div className='m-4'>
              <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>TOKEN HOLDINGS</h2>
              <ul className='ml-4'>
                {
                  realTokens!.length !== 0 ?
                    realTokens!.map((token, i) =>
                      <li key={i} className='list-disc text-[var(--grey-fg-color)]'>
                        <span className='text-[var(--main-fg-color)]'>
                          {`${token.name}: ${token.balance} ${token.symbol}`}
                        </span>
                      </li>)
                      :
                      '/'
                }
              </ul>
            </div>
          </div>
          :
          ''
      }
    </div>
  );
}