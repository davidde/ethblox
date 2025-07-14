'use client';

import { useState, useEffect } from 'react';
import ValueDisplay from '@/components/common/value-display';
import { getAlchemy } from '@/lib/utilities';
import { OwnedToken } from 'alchemy-sdk';


export default function Tokens(props: {
  hash: string,
  network: string
}) {
  if (props.network !== 'mainnet') return '';

  const alchemy = getAlchemy(props.network);
  const [tokens, setTokens] = useState<OwnedToken[]>();
  const [tokensError, setTokensError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const resp = await alchemy.core.getTokensForOwner(props.hash);
        // Remove scam tokens; everything without logo/symbol or zero balance:
        let filteredTokens = resp.tokens.filter(token =>
          token.logo && token.symbol && token.balance &&
          !(token.balance.startsWith('0') && token.balance.endsWith('0')));
        // Sort tokens alphabetically by symbol:
        filteredTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
        setTokens(filteredTokens);
      } catch(err) {
        const error = 'AddressPage Tokens getTokensForOwner() ' + err;
        console.error(error);
        setTokensError(error);
      }
    })();
  }, [alchemy, props.hash]);

  function getTokenList(tokens: OwnedToken[] | undefined ) {
    if (tokens && tokens.length === 0) return '/';
    return tokens?.map((token, i) =>
      <li key={i} className='ml-4 list-disc text-(--grey-fg-color)'>
        <span className='text-(--main-fg-color)'>
          {`${token.symbol}: ${parseFloat(token.balance!).toFixed(5)} (${token.name})`}
        </span>
      </li>
    );
  }

  return (
    <div className='pr-12 my-4'>
      <h2 className='capsTitle'>TOKEN HOLDINGS</h2>
      <ValueDisplay
        value={getTokenList(tokens)}
        error={tokensError}
        err='Error getting tokens'
      />
    </div>
  );
}