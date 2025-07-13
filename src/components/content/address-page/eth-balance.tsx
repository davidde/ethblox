'use client';

import { useState, useEffect } from 'react';
import ValueDisplay from '@/components/common/value-display';
import { Utils } from 'alchemy-sdk';
import { getAlchemy } from '@/lib/utilities';


export default function EthBalance(props: {
  hash: string,
  network: string
}) {
  const alchemy = getAlchemy(props.network);
  const showEthValue = props.network === 'mainnet' ? '' : 'hidden';

  const [ethBalance, setEthBalance] = useState<string>('');
  const [ethBalanceError, setEthBalanceError] = useState<string>();

  const [ethPrice, setEthPrice] = useState<{eur: number, usd: number}>();
  const [ethPriceError, setEthPriceError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const data = await alchemy.core.getBalance(props.hash, 'latest');
        setEthBalance(Utils.formatEther(data));
      } catch(err) {
        const error = 'AddressPage getBalance()' + err;
        console.error(error);
        setEthBalanceError(error);
      }
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
  }, [alchemy, props.hash, props.network]);

  let ethValue;
  if (ethPrice && ethBalance) {
    const valueEur = (+ethBalance * ethPrice.eur).toLocaleString(
      'en-US', { style: 'currency', currency: 'EUR' });
    const valueUsd = (+ethBalance * ethPrice.usd).toLocaleString(
      'en-US', { style: 'currency', currency: 'USD' });
    ethValue = `${valueUsd} (${valueEur})`;
  }
  const ethBalanceFormatted = ethBalance ? `Ξ${ethBalance}` : undefined;

  return (
    <div className='pr-12'>
      <div className='my-4'>
        <h2 className='capsTitle'>ETH BALANCE</h2>
        <ValueDisplay value={ethBalanceFormatted} error={ethBalanceError}
          err='Error getting Ether balance' />
      </div>
      <div className={`my-4 ${showEthValue}`}>
        <h2 className='capsTitle'>TOTAL ETH VALUE</h2>
        <ValueDisplay value={ethValue} error={ethPriceError || ethBalanceError}
          err='Error getting Ether value' />
      </div>
    </div>
  );
}