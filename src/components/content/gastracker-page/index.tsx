'use client';

import { useState, useEffect } from 'react';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import GastrackerCard from './gastracker-card';
import BreakMobile from '@/components/common/break-mobile';
import PageWrapper from '@/components/common/page-wrapper';


export default function GastrackerPage() {
  const [ethPrice, setEthPrice] = useState<number>();
  const [lowGasPrice, setLowGasPrice] = useState<number>();
  const [averageGasPrice, setAverageGasPrice] = useState<number>();
  const [highGasPrice, setHighGasPrice] = useState<number>();
  const [priceError, setPriceError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('https://eth.blockscout.com/api/v2/stats');
        if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
        const data = await res.json();
        setEthPrice(+data.coin_price);
        setLowGasPrice(+data.gas_prices.slow);
        setAverageGasPrice(+data.gas_prices.average);
        setHighGasPrice(+data.gas_prices.fast);
      } catch(err) {
        const error = 'GastrackerPage Price fetch ' + err;
        console.error(error);
        setPriceError(error);
      }
    })();
  }, []);

  const lowGasPriceGwei = getGasPriceGwei(lowGasPrice);
  const lowGasPriceUsd = getGasPriceUsd(lowGasPrice, ethPrice);
  const averageGasPriceGwei = getGasPriceGwei(averageGasPrice);
  const averageGasPriceUsd = getGasPriceUsd(averageGasPrice, ethPrice);
  const highGasPriceGwei = getGasPriceGwei(highGasPrice);
  const highGasPriceUsd = getGasPriceUsd(highGasPrice, ethPrice);

  return (
    <main>
      {/* The min-width is applied to keep the width of the whole page constant while data reloads: */}
      <PageWrapper className='min-w-[min(62rem,_100%)]'>
        <div className='flex flex-col items-center'>
          <div className='w-full md:w-[85%] flex flex-col md:flex-row justify-between items-center
                          my-5 md:my-10 mx-auto p-1 md:py-5 md:px-3 bg-(--card-bg-color)
                          rounded-lg shadow-lg ring-1 ring-(--border-color) ring-opacity-5'>
            <ChartBarIcon className='w-8 h-8 text-(--grey-fg-color)/80 self-start' />
            <p className='text-3xl text-(--grey-fg-color)/80 italic font-medium
              tracking-wide wordsp-[0.8em] md:mx-[1.6em] content-center'>
              ETHEREUM <BreakMobile />GAS TRACKER
            </p>
            <ChartBarIcon className='w-8 h-8 text-(--grey-fg-color)/80 scale-x-[-1] self-end' />
          </div>

          <div className='flex flex-col md:flex-row items-start
            justify-between ml-auto mr-auto w-full max-w-200 my-10'>
            <GastrackerCard
              title='Low'
              gasPriceGwei={lowGasPriceGwei}
              gasPriceUsd={lowGasPriceUsd}
              priceError={priceError}
              smiley='😎'
              smileyLabel='smiling face with sunglasses'
              colorClass='text-green-600'
            />
            <GastrackerCard
              title='Average'
              gasPriceGwei={averageGasPriceGwei}
              gasPriceUsd={averageGasPriceUsd}
              priceError={priceError}
              smiley='😁'
              smileyLabel='beaming face with smiling eyes'
              colorClass='text-blue-600'
            />
            <GastrackerCard
              title='High'
              gasPriceGwei={highGasPriceGwei}
              gasPriceUsd={highGasPriceUsd}
              priceError={priceError}
              smiley='😵'
              smileyLabel='face with crossed-out eyes'
              colorClass='text-red-600'
            />
          </div>
        </div>
      </PageWrapper >
    </main>
  );
}
