'use client';

import { useState, useEffect } from 'react';
import ValueDisplay from '@/components/common/value-display';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { ChartBarIcon } from '@heroicons/react/24/outline';


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
            ETHEREUM <br className='md:hidden'/>GAS TRACKER
          </p>
          <ChartBarIcon className='w-8 h-8 text-slate-500 scale-x-[-1] self-end' />
        </div>
        <div className='flex flex-col md:flex-row items-start justify-between w-full max-w-200 my-10'>
          <div className='border border-(--border-color) rounded-lg px-16 py-4 w-58 ml-auto mr-auto'>
            <p className='font-bold mb-3'>
              <span className='text-xl mr-2' role="img" aria-label="smiling face with sunglasses">😎</span>
              Low
            </p>
            <p className='text-lg tracking-wide text-green-600'>
              <ValueDisplay value={lowGasPriceGwei} error={priceError} err='Error' />
            </p>
            <p className='text-sm tracking-wide text-green-600'>
              <ValueDisplay value={lowGasPriceUsd} error={priceError} err='Error' load={false} />
            </p>
          </div>
          <div className='border border-(--border-color) rounded-lg my-4 md:my-0 px-16 py-4 w-58 ml-auto mr-auto'>
            <p className='font-bold mb-3'>
              <span className='text-xl mr-2' role="img" aria-label="beaming face with smiling eyes">😁</span>
              Average
            </p>
            <p className='text-lg tracking-wide text-blue-600'>
              <ValueDisplay value={averageGasPriceGwei} error={priceError} err='Error' />
            </p>
            <p className='text-sm tracking-wide text-blue-600'>
              <ValueDisplay value={averageGasPriceUsd} error={priceError} err='Error' load={false} />
            </p>
          </div>
          <div className='border border-(--border-color) rounded-lg px-16 py-4 w-58 ml-auto mr-auto'>
            <p className='font-bold mb-3'>
              <span className='text-xl mr-2' role="img" aria-label="flushed face">😳</span>
              High
            </p>
            <p className='text-lg tracking-wide text-red-600'>
              <ValueDisplay value={highGasPriceGwei} error={priceError} err='Error' />
            </p>
            <p className='text-sm tracking-wide text-red-600'>
              <ValueDisplay value={highGasPriceUsd} error={priceError} err='Error' load={false} />
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
