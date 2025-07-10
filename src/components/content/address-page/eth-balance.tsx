'use client';

import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';
import { useState, useEffect } from 'react';


export default function EthBalance(props: {
  ethBalance: string,
  network: string
}) {
  const [ethPrice, setEthPrice] = useState<{eur: number, usd: number}>();
  const [ethPriceError, setEthPriceError] = useState<string>();
  const showEthValue = props.network === 'mainnet' ? '' : 'hidden';

  useEffect(() => {
    (async () => {
      if (props.network === 'mainnet') {
        try {
          const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
          if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
          const data = await res.json();
          setEthPrice(data.ethereum);
        } catch(err) {
          const error = 'AddressPage EthBalance price:' + err;
          console.error(error);
          setEthPriceError(error);
        }
      }
    })();
  }, [props.network]); // Re-run effect whenever props.network changes

  let ethValue;
  if (ethPrice) {
    const valueEur = (+props.ethBalance * ethPrice.eur).toLocaleString(
      'en-US', { style: 'currency', currency: 'EUR' });
    const valueUsd = (+props.ethBalance * ethPrice.usd).toLocaleString(
      'en-US', { style: 'currency', currency: 'USD' });
    ethValue = `${valueUsd} (${valueEur})`;
  }

  return (
    <div className='pr-12'>
      <div className='my-4'>
        <h2 className='text-sm tracking-wider text-(--grey-fg-color)'>ETH BALANCE</h2>
        Ξ{props.ethBalance}
      </div>
      <div className={`my-4 ${showEthValue}`}>
        <h2 className='text-sm tracking-wider text-(--grey-fg-color)'>TOTAL ETH VALUE</h2>
        {ethValue || (ethPriceError ?
                      <ErrorIndicator error={'Error getting Ether value'} />
                      :
                      <LoadingIndicator />)}
      </div>
    </div>
  );
}