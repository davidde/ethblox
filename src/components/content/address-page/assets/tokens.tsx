'use client';

import { useState, useEffect, Fragment } from 'react';
import { getAlchemy } from '@/lib/utilities';
import { OwnedToken } from 'alchemy-sdk';
import LoadingIndicator from '@/components/common/loading-indicator';
import { TokenDropdown } from './token-dropdown';
import ErrorIndicator from '@/components/common/error-indicator';


export type Token = {
  name: string,
  symbol: string,
  balance: string,
  address: string,
}

export default function Tokens(props: {
  hash: string,
  network: string
}) {
  const alchemy = getAlchemy(props.network);
  const [ownedTokens, setOwnedTokens] = useState<OwnedToken[]>();
  const [ownedTokensError, setOwnedTokensError] = useState<string>();

  useEffect(() => {
    if (props.network === 'mainnet') (async () => {
      try {
        const resp = await alchemy.core.getTokensForOwner(props.hash);
        // Remove scam tokens; everything without name/logo/symbol or zero balance:
        let filteredTokens = resp.tokens.filter(token =>
          token.name && token.logo && token.symbol && token.balance &&
          !(token.balance.startsWith('0') && token.balance.endsWith('0')));
        // Sort tokens alphabetically by symbol:
        filteredTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
        setOwnedTokens(filteredTokens);
      } catch(err) {
        const error = 'AddressPage Tokens getTokensForOwner() ' + err;
        console.error(error);
        setOwnedTokensError(error);
      }
    })();
  }, [alchemy, props.hash]);

  function getTokenList(tokens: OwnedToken[]): Token[] {
    return tokens.map((token) => {
      const bal = parseFloat(token.balance!);
      const isZero = bal === 0;
      let balance = bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
      balance = !isZero && balance === '0.00' ? '~0.00' : balance;

      return ({ // We can use non-null assertion since we filtered out null
        name: token.name!, // and undefined values in useEffect() above!
        symbol: token.symbol!,
        balance: balance,
        address: token.contractAddress,
      })
    });
  }

  let tokens, fallback;
  if (!ownedTokens) {
    fallback = <LoadingIndicator />;
    if (ownedTokensError) fallback = <ErrorIndicator error='Error getting tokens' />;
  }
  else if (ownedTokens.length === 0) fallback = <span>/</span>;
  else tokens = getTokenList(ownedTokens);

  return (
    <div>
      <h2 className='capsTitle'>TOKEN HOLDINGS</h2>
      {
        tokens ?
          <TokenDropdown tokens={tokens} /> : fallback
      }
    </div>
  );
}