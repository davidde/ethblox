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
      <div className='flex flex-col items-center py-4'>
        <div className='flex py-10 ml-auto mr-auto'>
          <ChartBarIcon className='w-8 h-8' />
          <p className='pl-4 text-2xl'>Ethereum Gas Tracker</p>
        </div>
        <div className='flex flex-col md:flex-row items-start justify-between w-full max-w-200 mt-2'>
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
