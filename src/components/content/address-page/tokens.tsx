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
      let tokens = await props.alchemy.core.getTokensForOwner(props.hash);
      // apparently, getTokensForOwner() randomly returns an array with almost everything undefined,
      // which ruins the filter function, so we redo the function when balance is undefined:
      while (!tokens.tokens[0].balance) tokens = await props.alchemy.core.getTokensForOwner(props.hash);
      // Remove tokens with zero balance or undefined logo or symbol:
      realTokens = tokens.tokens.filter((token) => {
        return token.balance !== '0.0' && token.logo !== undefined && token.symbol !== undefined;
      });
      // Sort tokens alphabetically by symbol:
      realTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
    } catch(err) {
      console.error('getTokensForOwner()', err);
    }
  }

  return (
    <div className={`${showTokens} pr-12 my-4`}>
      <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>TOKEN HOLDINGS</h2>
      <ul>
        {
          realTokens === undefined ? <p className='text-red-500'>Error getting tokens.</p> :
          realTokens.length === 0 ? '/' :
            realTokens.map((token, i) => {
              let balance = parseFloat(token.balance ?? '0').toFixed(8);
              balance = balance.includes('.') && balance.endsWith('0') ? parseFloat(balance).toString() : balance;
              return (
                <li key={i} className='ml-4 list-disc text-[var(--grey-fg-color)]'>
                  <span className='text-[var(--main-fg-color)]'>
                    {`${token.symbol}: ${balance} (${token.name})`}
                  </span>
                </li>
              );
            })
        }
      </ul>
    </div>
  );
}