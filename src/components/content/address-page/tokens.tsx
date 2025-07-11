'use client';

import { useState, useEffect } from 'react';
import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';
import { getAlchemy } from '@/lib/utilities';
import { OwnedToken } from 'alchemy-sdk';


export default function Tokens(props: {
  hash: string,
  network: string
}) {
  const alchemy = getAlchemy(props.network);
  const [realTokens, setRealTokens] = useState<OwnedToken[]>();
  const [realTokensError, setRealTokensError] = useState<string>();
  const showTokens = props.network === 'mainnet' ? '' : 'hidden';

  useEffect(() => {
    (async () => {
      if (props.network === 'mainnet') {
        try {
          let tokens = await alchemy.core.getTokensForOwner(props.hash);
          // Remove scam tokens; everything with zero balance or undefined logo or symbol:
          let filteredTokens = tokens.tokens.filter(token => token.balance !== '0.0' && token.logo !== undefined && token.symbol !== undefined);
          // Sort tokens alphabetically by symbol:
          filteredTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
          setRealTokens(filteredTokens);
        } catch(err) {
          const error = 'AddressPage Tokens getTokensForOwner()' + err;
          console.error(error);
          setRealTokensError(error);
        }
      }
    })();
  }, [props.hash, props.network]);

  return (
    <div className={`${showTokens} pr-12 my-4`}>
      <h2 className='capsTitle'>TOKEN HOLDINGS</h2>
      <ul>
        {
          realTokens !== undefined ?
            ( realTokens.length !== 0 ?
              (realTokens.map((token, i) => {
                let balance = parseFloat(token.balance ?? '0').toFixed(8);
                balance = balance.includes('.') && balance.endsWith('0') ? parseFloat(balance).toString() : balance;
                return <li key={i} className='ml-4 list-disc text-(--grey-fg-color)'>
                    <span className='text-(--main-fg-color)'>
                      {`${token.symbol}: ${balance} (${token.name})`}
                    </span>
                </li>}))
              :
              '/'
            )
            :
            (realTokensError ?
              <ErrorIndicator error='Error getting tokens.' />
              :
              <LoadingIndicator />)
        }
      </ul>
    </div>
  );
}