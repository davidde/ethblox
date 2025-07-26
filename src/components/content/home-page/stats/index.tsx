'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import StatCard from './stat-card';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { useDataState } from '@/lib/data-state';


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

  // ethMarketCap is dependent on both DataStates, so we pick the one in error or loading state
  // for passing down to StatCard:
  let ethMarketCapData;
  if (pricesAndTxsData.error || !pricesAndTxsData.value) ethMarketCapData = pricesAndTxsData;
  else ethMarketCapData = ethSupplyData;
  // If it is in defined ValueState, either DataState is ok since we pass the value callback below:
  const ethMarketCap = () => (ethPrice! * ethSupply!).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12 py-2 md:py-0'>
      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='ETHER PRICE'
          icon={<CurrencyDollarIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={ethPriceFormatted}
          refetch={pricesAndTxsData.refetch}
          className='md:border-b'
        />
        <StatCard
          label='ETHER SUPPLY'
          icon={<div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />}
          dataState={ethSupplyData}
          value={ethSupplyFormatted}
          refetch={ethSupplyData.refetch}
          className='md:border-b md:border-x'
        />
        <StatCard
          label='ETHER MARKET CAP'
          icon={<GlobeAltIcon className='w-8 h-8' />}
          dataState={ethMarketCapData}
          value={ethMarketCap}
          // ethMarketCap depends on both data fetches, so potentially refetch both:
          refetch={async () => {
            if (pricesAndTxsData.error) pricesAndTxsData.refetch();
            if (ethSupplyData.error) ethSupplyData.refetch();
          }}
          className='md:border-b'
        />
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='AVERAGE GAS PRICE'
          icon={<FireIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={averageGasPriceLink}
          refetch={pricesAndTxsData.refetch}
        />
        <StatCard
          label='TRANSACTIONS TODAY'
          icon={<ClipboardDocumentListIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => transactionsToday!}
          refetch={pricesAndTxsData.refetch}
          className='md:border-x'
        />
        <StatCard
          label='TOTAL TRANSACTIONS'
          icon={<Square3Stack3DIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => totalTransactions!}
          refetch={pricesAndTxsData.refetch}
        />
      </div>
    </div>
  );
}
