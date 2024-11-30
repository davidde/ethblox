import { Alchemy } from 'alchemy-sdk';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Tokens(props: Props) {
  let realTokens;
  const showTokens = props.network === 'mainnet' ? '' : 'hidden';

  if (props.network === 'mainnet') {
    try {
      const tokens = await props.alchemy.core.getTokensForOwner(props.hash);
      // Remove tokens with zero balance or undefined logo or symbol:
      realTokens = tokens.tokens.filter((token) => {
        return token.balance !== '0.0' && token.logo !== undefined && token.symbol !== undefined;
      });
      // Sort tokens alphabetically by symbol:
      realTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
    } catch(err) {
      console.error('getTokensForOwner() Error: ', err);
    }
  }

  return (
    <div className='pr-12'>
      <div className={`m-4 ${showTokens}`}>
        <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>TOKEN HOLDINGS</h2>
        <ul>
          {
            realTokens === undefined ? <p className='text-red-500'>Error getting tokens.</p> :
            realTokens.length === 0 ? '/' :
              realTokens.map((token, i) =>
                <li key={i} className='ml-4 list-disc text-[var(--grey-fg-color)]'>
                  <span className='text-[var(--main-fg-color)]'>
                    {`${token.symbol}: ${parseFloat(parseFloat(token.balance ?? '0').toFixed(8))} (${token.name})`}
                  </span>
                </li>)
          }
        </ul>
      </div>
    </div>
  );
}