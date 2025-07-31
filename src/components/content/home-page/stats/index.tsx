'use client';

import { useEffect } from 'react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import StatCard from './stat-card';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { useDataState, DataState } from '@/lib/data-state';


type EthSupplyData = {
  available_supply: string;
}

type PricesAndTxsData = {
  coin_price: string;
  gas_prices: {
    average: number;
  };
  transactions_today: string;
  total_transactions: string;
}

export default function Stats() {
  const ethSupplyData = useDataState<EthSupplyData, [string]>({
    args: ['https://eth.blockscout.com/api/v2/stats/charts/market'],
  });
  const ethSupply = ethSupplyData.value ? +ethSupplyData.value.available_supply : undefined;
  const ethSupplyFormatted = ethSupply ?
    `Ξ${ethSupply.toLocaleString('en-US', { maximumFractionDigits: 2, })}` : undefined;

  const pricesAndTxsData = useDataState<PricesAndTxsData, [string]>({
    args: ['https://eth.blockscout.com/api/v2/stats'],
  });

  let ethPrice: number | undefined;
  let ethPriceFormatted: string;
  let averageGasPrice: number;
  let averageGasPriceFormatted: string;
  let transactionsToday: string;
  let totalTransactions: string;

  if (pricesAndTxsData.value) {
    ethPrice = +pricesAndTxsData.value.coin_price;
    ethPriceFormatted = ethPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    })
    averageGasPrice = +pricesAndTxsData.value.gas_prices.average;
    averageGasPriceFormatted = `${getGasPriceGwei(averageGasPrice)} ${getGasPriceUsd(averageGasPrice, ethPrice)}`
    transactionsToday = (+pricesAndTxsData.value.transactions_today).toLocaleString('en-US');
    totalTransactions = (+pricesAndTxsData.value.total_transactions).toLocaleString('en-US');
  }

  const ethMarketCapFormatted = (ethPrice && ethSupply) ?
    (ethPrice * ethSupply).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }) : undefined;

  // Since ethMarketCapFormatted is dependent on both fetches / DataStates, we need a new
  // DataState for it to correctly render when it is in Error or Loading states.
  // Contrary to `useDataState`, `DataState.useConfig()` just creates the (undefined) DataState
  // (LoadingRoot) from the fetcher, without actually running the fetcher:
  const ethMarketCapData = DataState.useConfig<any>({
    fetcher: async () => await Promise.all([pricesAndTxsData.fetch(), ethSupplyData.fetch()])
  });

  // Give it a correct value if both fetches have already succeeded or an error if not:
  // (This requires `useEffect` because of setValue/setError)
  useEffect(() => {
    if (ethMarketCapFormatted) {
      ethMarketCapData.setValue(ethMarketCapFormatted);
    }
    if (pricesAndTxsData.error || ethSupplyData.error) {
      ethMarketCapData.setError('Price or supply fetch failed');
    }
  // Dont include `ethMarketCapData` as a dependency as `react-hooks` says,
  // or it'll cause an infinite loop!
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethMarketCapFormatted]);

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12 py-2 md:py-0'>
      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='ETHER PRICE'
          icon={<CurrencyDollarIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => ethPriceFormatted}
          className='md:border-b'
        />
        <StatCard
          label='ETHER SUPPLY'
          icon={<div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />}
          dataState={ethSupplyData}
          value={() => ethSupplyFormatted }
          className='md:border-b md:border-x'
        />
        <StatCard
          label='ETHER MARKET CAP'
          icon={<GlobeAltIcon className='w-8 h-8' />}
          dataState={ethMarketCapData}
          value={() => ethMarketCapFormatted }
          className='md:border-b'
        />
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <StatCard
          label='AVERAGE GAS PRICE'
          icon={<FireIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() =>
            <Link href='/mainnet/gastracker'
              className='text-(--link-color) hover:text-(--hover-fg-color)'>
              {averageGasPriceFormatted}
            </Link>
          }
        />
        <StatCard
          label='TRANSACTIONS TODAY'
          icon={<ClipboardDocumentListIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => transactionsToday}
          className='md:border-x'
        />
        <StatCard
          label='TOTAL TRANSACTIONS'
          icon={<Square3Stack3DIcon className='w-8 h-8' />}
          dataState={pricesAndTxsData}
          value={() => totalTransactions}
        />
      </div>
    </div>
  );
}
