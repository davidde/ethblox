'use client';

import { useState, useEffect } from 'react';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import GastrackerCard from './gastracker-card';
import BreakMobile from '@/components/common/break-mobile';


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
      <div className='flex flex-col items-center'>
        <div className='flex flex-col md:flex-row md:pb-5 my-5 md:my-10 ml-auto mr-auto md:border-b border-slate-400 justify-between items-center'>
          <ChartBarIcon className='w-8 h-8 text-slate-500 self-start' />
          <p className='text-3xl text-slate-500 italic font-medium
            tracking-wide wordsp-[0.8em] mx-[1.6em]'>
            ETHEREUM <BreakMobile />GAS TRACKER
          </p>
          <ChartBarIcon className='w-8 h-8 text-slate-500 scale-x-[-1] self-end' />
        </div>
        <div className='flex flex-col md:flex-row items-start
          justify-between w-full max-w-200 my-10'>
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
    </main>
  );
}
