'use client';

import { useState, useEffect } from 'react';
import ValueDisplay from '@/components/common/value-display';
import { Utils } from 'alchemy-sdk';
import { useAlchemy } from '@/lib/utilities';
import Tokens from './tokens';


export default function Assets(props: {
  hash: string,
  network: string
}) {
  const alchemy = useAlchemy(props.network);

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
  let columnClass = 'flex flex-col justify-between my-3 md:my-4 h-[3rem] min-w-[17rem]';
  const hideOnTestnet = props.network !== 'mainnet' ? 'hidden' : columnClass;

  return (
    <div>
      <p className='mt-4'>
        <span>▶ &nbsp;</span>
        <span className='capsTitle italic !text-base !text-(--main-fg-color)
                        w-fit border-b border-b-(--main-fg-color)'>
          ASSETS
        </span>
      </p>
      <div className='flex flex-col md:flex-row justify-between md:gap-[2rem] ml-[1.5rem]'>
        <div className={columnClass}>
          <h2 className='capsTitle'>ETH BALANCE</h2>
          <ValueDisplay value={ethBalanceFormatted} error={ethBalanceError}
            err='Error getting Ether balance' />
        </div>
        <div className={hideOnTestnet}>
          <h2 className='capsTitle'>TOTAL ETH VALUE</h2>
          <ValueDisplay value={ethValue} error={ethPriceError || ethBalanceError}
            err='Error getting Ether value' />
        </div>
        <div className={hideOnTestnet}>
          <Tokens
            hash={props.hash}
            network={props.network}
          />
        </div>
      </div>
    </div>
  );
}