'use client';

import { useState, useEffect } from 'react';
import { getAlchemy } from '@/lib/utilities';
import { OwnedToken } from 'alchemy-sdk';
import LoadingIndicator from '@/components/common/loading-indicator';
import { TokenDropdown } from './token-dropdown';
import ErrorIndicator from '@/components/common/error-indicator';


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

  let fallback;
  if (!ownedTokens) {
    fallback = <LoadingIndicator />;
    if (ownedTokensError) fallback = <ErrorIndicator error='Error getting tokens' />;
  }
  else if (ownedTokens.length === 0) fallback = <span>/</span>;

  return (
    <div>
      <h2 className='capsTitle'>TOKEN HOLDINGS</h2>
      {
        fallback ?
          fallback : <TokenDropdown tokens={ownedTokens!} />
      }
    </div>
  );
}