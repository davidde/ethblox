'use client';

import { useState, useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import StatCard from './stat-card';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import DataState from '@/lib/data-state';


type PricesTxs = {
  ethPrice: number,
  averageGasPrice: number,
  transactionsToday: string,
  totalTransactions: string,
};

export default function Stats() {
  const [ethSupply, setEthSupply] = useState(DataState.value<number>());
  const [pricesAndTxs, setPricesAndTxs] = useState(DataState.value<PricesTxs>());

  async function getEthSupply() {
    try {
      const res = await fetch('https://eth.blockscout.com/api/v2/stats/charts/market');
      if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
      const json = await res.json();
      setEthSupply(DataState.value(+json.available_supply));
    } catch (err) {
      setEthSupply(DataState.error(err));
    }
  }

  async function getPricesAndTransactions() {
    try {
      const res = await fetch('https://eth.blockscout.com/api/v2/stats');
      if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
      const json = await res.json();
      setPricesAndTxs(DataState.value({
        ethPrice: +json.coin_price,
        averageGasPrice: +json.gas_prices.average,
        transactionsToday: (+json.transactions_today).toLocaleString('en-US'),
        totalTransactions: (+json.total_transactions).toLocaleString('en-US'),
      }));
    } catch (err) {
      setPricesAndTxs(DataState.error(err));
    }
  }

  useEffect(() => {
    getEthSupply();
    getPricesAndTransactions();
  }, []);

  const averageGasPriceLink = () =>
    <Link href='/mainnet/gastracker'
      className='text-(--link-color) hover:text-(--hover-fg-color)'>
      {getGasPriceGwei(pricesAndTxs.value!.averageGasPrice)} {getGasPriceUsd(pricesAndTxs.value!.averageGasPrice, pricesAndTxs.value!.ethPrice)}
    </Link>;
  const ethPriceFormatted = () => pricesAndTxs.value!.ethPrice.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const ethSupplyFormatted = () =>
    `Ξ${ethSupply.value!.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`;

  // ethMarketCap is dependent on both DataStates, so we make a single new DataState
  // for it exclusively for passing down to GastrackerCard:
  let ethMarketCap = DataState.value<string>();
  if (pricesAndTxs.value && ethSupply.value) {
    ethMarketCap = DataState.value((pricesAndTxs.value.ethPrice * ethSupply.value).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }));
  } else if (pricesAndTxs.error) {
    ethMarketCap = DataState.error(pricesAndTxs.error);
  } else if (ethSupply.error) {
    ethMarketCap = DataState.error(ethSupply.error);
  }

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color) rounded-lg
                    w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12 py-2 md:py-0'>
      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='ETHER PRICE'
          icon={<CurrencyDollarIcon className='w-8 h-8' />}
          data={pricesAndTxs}
          value={ethPriceFormatted}
          className='md:border-b'
        />
        <StatCard
          label='ETHER SUPPLY'
          icon={<div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />}
          data={ethSupply}
          value={ethSupplyFormatted}
          className='md:border-b md:border-x'
        />
        <StatCard
          label='ETHER MARKET CAP'
          icon={<GlobeAltIcon className='w-8 h-8' />}
          data={ethMarketCap}
          value={() => ethMarketCap.value}
          className='md:border-b'
        />
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='AVERAGE GAS PRICE'
          icon={<FireIcon className='w-8 h-8' />}
          data={pricesAndTxs}
          value={averageGasPriceLink}
        />
        <StatCard
          label='TRANSACTIONS TODAY'
          icon={<ClipboardDocumentListIcon className='w-8 h-8' />}
          data={pricesAndTxs}
          value={() => pricesAndTxs.value!.transactionsToday}
          className='md:border-x'
        />
        <StatCard
          label='TOTAL TRANSACTIONS'
          icon={<Square3Stack3DIcon className='w-8 h-8' />}
          data={pricesAndTxs}
          value={() => pricesAndTxs.value!.totalTransactions}
        />
      </div>
    </div>
  );
}
