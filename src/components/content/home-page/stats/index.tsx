'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import StatCard from './stat-card';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { useDataState, DataState, DataStateBase } from '@/lib/data-state';
import { useCallback } from 'react';


export default function Stats() {
  const ethSupplyData = useDataState<any>({
    fetcher: (url) => fetch(url),
    args: ['https://eth.blockscout.com/api/v2/stats/charts/market'],
  });

  const pricesAndTxsData = useDataState<any>({
    fetcher: (url) => fetch(url),
    args: ['https://eth.blockscout.com/api/v2/stats'],
  });

  const ethSupply = ethSupplyData.value ? +ethSupplyData.value.available_supply : undefined;

  let ethPrice, averageGasPrice, transactionsToday, totalTransactions;
  if (pricesAndTxsData.value) {
    ethPrice = +pricesAndTxsData.value.coin_price;
    averageGasPrice = +pricesAndTxsData.value.gas_prices.average;
    transactionsToday = (+pricesAndTxsData.value.transactions_today).toLocaleString('en-US');
    totalTransactions = (+pricesAndTxsData.value.total_transactions).toLocaleString('en-US');
  }

  const averageGasPriceLink = () =>
    <Link href='/mainnet/gastracker'
      className='text-(--link-color) hover:text-(--hover-fg-color)'>
      {getGasPriceGwei(averageGasPrice!)} {getGasPriceUsd(averageGasPrice!, ethPrice!)}
    </Link>;
  const ethPriceFormatted = () => ethPrice!.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const ethSupplyFormatted = () =>
    `Ξ${ethSupply!.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`;

  // Since we need a DataState for correctly rendering Errors or Loading states,
  // and ethMarketCap is dependent on both DataStates, we create a new DataState for it:
  let ethMarketCapData = useDataState({
    fetcher: async () => await Promise.all([pricesAndTxsData.refetch(), ethSupplyData.refetch()])
  });
  // ethMarketCapData.value = ethPrice && ethSupply ?
  //   (ethPrice * ethSupply).toLocaleString('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   })
  //   :
  //   undefined;
  // ethMarketCapData.error = pricesAndTxsData.error || ethSupplyData.error ?
  //   new Error('Price and supply fetches both failed')
  //   :
  //   undefined;

  const ethMarketCap = () => (ethPrice! * ethSupply!).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  console.log('ethMarketCapData = ', ethMarketCapData);
  console.log('ethMarketCap = ', ethMarketCap());
  console.log('ethMarketCapData.value = ', ethMarketCapData.value);

  // if (pricesAndTxsData.error || ethSupplyData.error) {
  //   if (pricesAndTxsData.error && ethSupplyData.error) {
  //     ethMarketCapData = pricesAndTxsData;
  //     ethMarketCapData.error = new Error('Price and supply fetches both failed');
  //     // How to make this work: ???
  //     // ethMarketCapData.refetch = async () => { await Promise.all([pricesAndTxsData.refetch(), ethSupplyData.refetch()]) };
  //     ethMarketCapData.refetch = pricesAndTxsData.refetch;
  //   }
  //   else if (pricesAndTxsData.error) {
  //     ethMarketCapData = pricesAndTxsData;
  //     ethMarketCapData.refetch = pricesAndTxsData.refetch;
  //   } else {
  //     ethMarketCapData = ethSupplyData;
  //     ethMarketCapData.refetch = ethSupplyData.refetch;
  //   }
  // }
  // else if (!pricesAndTxsData.value || !ethSupplyData.value) {
  //   if (!pricesAndTxsData.value) ethMarketCapData = pricesAndTxsData;
  //   else ethMarketCapData = ethSupplyData;
  // } else ethMarketCapData = ethSupplyData;
  // // If it is in defined ValueState, either DataState is ok since we pass the value callback below:
  // const ethMarketCap = () => (ethPrice! * ethSupply!).toLocaleString('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  // });

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12 py-2 md:py-0'>
      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='ETHER PRICE'
          icon={<CurrencyDollarIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={ethPriceFormatted}
          className='md:border-b'
        />
        <StatCard
          label='ETHER SUPPLY'
          icon={<div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />}
          dataState={ethSupplyData}
          value={ethSupplyFormatted}
          className='md:border-b md:border-x'
        />
        <StatCard
          label='ETHER MARKET CAP'
          icon={<GlobeAltIcon className='w-8 h-8' />}
          dataState={ethMarketCapData}
          value={ethMarketCap}
          className='md:border-b'
        />
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='AVERAGE GAS PRICE'
          icon={<FireIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={averageGasPriceLink}
        />
        <StatCard
          label='TRANSACTIONS TODAY'
          icon={<ClipboardDocumentListIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => transactionsToday!}
          className='md:border-x'
        />
        <StatCard
          label='TOTAL TRANSACTIONS'
          icon={<Square3Stack3DIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => totalTransactions!}
        />
      </div>
    </div>
  );
}
