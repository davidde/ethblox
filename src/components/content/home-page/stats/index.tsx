'use client';

import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';


export default function Stats() {
  const [ethSupply, setEthSupply] = useState<number>();
  const [ethSupplyError, setEthSupplyError] = useState<string>();

  const [ethPrice, setEthPrice] = useState<number>();
  const [averageGasPrice, setAverageGasPrice] = useState<number>();
  const [transactionsToday, setTransactionsToday] = useState<string>();
  const [totalTransactions, setTotalTransactions] = useState<string>();
  const [ethPriceError, setEthPriceError] = useState<string>();

  async function getEthSupply() {
    try {
      const res = await fetch('https://eth.blockscout.com/api/v2/stats/charts/market');
      if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
      const json = await res.json();
      setEthSupply(+json.available_supply);
    } catch (err) {
      const error = 'ETH supply Stats fetch error:' + err;
      console.error(error);
      setEthSupplyError(error);
    }
  }

  async function getPriceAndTransactions() {
    try {
      const res = await fetch('https://eth.blockscout.com/api/v2/stats');
      if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
      const json = await res.json();
      setEthPrice(+json.coin_price);
      setAverageGasPrice(+json.gas_prices.average);
      setTransactionsToday((+json.transactions_today).toLocaleString('en-US'));
      setTotalTransactions((+json.total_transactions).toLocaleString('en-US'));
    } catch (err) {
      const error = 'ETH price/transaction Stats fetch error:' + err;
      console.error(error);
      setEthPriceError(error);
    }
  }

  useEffect(() => {
    getEthSupply();
    getPriceAndTransactions();
  }, []);

  const avgGasAmountPerTransfer = 21000;
  const gweiPrice = ethPrice ? (ethPrice / 1e9) : undefined;
  const averageGasPriceUsd = averageGasPrice && gweiPrice ?
    (averageGasPrice * avgGasAmountPerTransfer * gweiPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  const averageGasPriceGwei = averageGasPrice?.toLocaleString('en-US', { maximumFractionDigits: 3 });

  const ethPriceFormatted = ethPrice?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const ethSupplyFormatted = ethSupply ?
    `Ξ${ethSupply.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`
    : undefined;
  const ethMarketCap = ethPrice && ethSupply ?
    (ethPrice * ethSupply).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    : undefined;

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12'>
      <div className='flex flex-col md:flex-row justify-between'>
        <div className='w-56 md:w-[calc(100%/3)] pl-4 py-4 md:border-b border-(--border-color)'>
          <div className='flex'>
            <CurrencyDollarIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>ETHER PRICE</p>
          </div>
          <div className='pl-12'>
            {ethPriceFormatted || (ethPriceError ?
                                  <ErrorIndicator error='Error' />
                                  :
                                  <LoadingIndicator />)}
          </div>
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] py-0 md:py-4 md:border-b md:border-x border-(--border-color)'>
          <div className='flex'>
            <div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>ETHER SUPPLY</p>
          </div>
          <div className='pl-12'>
            { ethSupplyFormatted || (ethSupplyError ?
                                  <ErrorIndicator error='Error' />
                                  :
                                  <LoadingIndicator />)}
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4 md:border-b border-(--border-color)'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <GlobeAltIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>ETHER MARKET CAP</p>
            </div>
            <div className='pl-12'>
              {ethMarketCap || ((ethPriceError || ethSupplyError) ?
                                <ErrorIndicator error='Error' />
                                :
                                <LoadingIndicator />)}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <div className='w-56 md:w-[calc(100%/3)] pl-4 py-0 md:py-4'>
          <div className='flex'>
          <FireIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>AVERAGE GAS PRICE</p>
          </div>
          {
            averageGasPriceUsd ?
            <Link
              href='/mainnet/gastracker'
              className='pl-12 text-(--link-color) hover:text-(--hover-fg-color)'
            >
              {`${averageGasPriceGwei} gwei ($${averageGasPriceUsd})`}
            </Link>
            :
            (ethPriceError ?
                <ErrorIndicator error='Error' className='pl-12' />
                :
                <LoadingIndicator className='pl-12' />)
          }
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] pt-4 md:py-4 md:border-x border-(--border-color)'>
          <div className='flex'>
          <ClipboardDocumentListIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>TRANSACTIONS TODAY</p>
          </div>
          <div className='pl-12'>
            {transactionsToday || (ethPriceError ?
                                  <ErrorIndicator error='Error' />
                                  :
                                  <LoadingIndicator />)}
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <Square3Stack3DIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>TOTAL TRANSACTIONS</p>
            </div>
            <div className='pl-12'>
              {totalTransactions || (ethPriceError ?
                                    <ErrorIndicator error='Error' />
                                    :
                                    <LoadingIndicator />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
