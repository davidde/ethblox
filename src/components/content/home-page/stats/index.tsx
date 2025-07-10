'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StatCard from './stat-card';


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
    <div className='border border-(--border-color) bg-(--comp-bg-color) rounded-lg
                    w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12 py-2 md:py-0'>
      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label="ETHER PRICE"
          icon={<CurrencyDollarIcon className='w-8 h-8' />}
          value={ethPriceFormatted}
          error={ethPriceError}
          className='md:border-b'
        />
        <StatCard
          label="ETHER SUPPLY"
          icon={<div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />}
          value={ethSupplyFormatted}
          error={ethSupplyError}
          className='md:border-b md:border-x'
        />
        <StatCard
          label="ETHER MARKET CAP"
          icon={<GlobeAltIcon className='w-8 h-8' />}
          value={ethMarketCap}
          error={ethPriceError || ethSupplyError}
          className='md:border-b'
        />
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label="AVERAGE GAS PRICE"
          icon={<FireIcon className='w-8 h-8' />}
          value={
            averageGasPriceUsd && averageGasPriceGwei ? (
              <Link
                href='/mainnet/gastracker'
                className='text-(--link-color) hover:text-(--hover-fg-color)'
              >
                {`${averageGasPriceGwei} gwei ($${averageGasPriceUsd})`}
              </Link>
            ) : undefined
          }
          error={ethPriceError}
        />
        <StatCard
          label="TRANSACTIONS TODAY"
          icon={<ClipboardDocumentListIcon className='w-8 h-8' />}
          value={transactionsToday}
          error={ethPriceError}
          className='md:border-x'
        />
        <StatCard
          label="TOTAL TRANSACTIONS"
          icon={<Square3Stack3DIcon className='w-8 h-8' />}
          value={totalTransactions}
          error={ethPriceError}
        />
      </div>
    </div>
  );
}
