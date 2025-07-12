import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';
import { ChartBarIcon } from '@heroicons/react/24/outline';


export default async function GastrackerPage() {
  let ethPrice, lowGasPrice, averageGasPrice, highGasPrice;
  let ethPriceError = false;

  while (!ethPrice && !ethPriceError) {
    try {
      const response = await fetch('https://eth.blockscout.com/api/v2/stats');
      if (response.status === 200) {
        const data = await response.json();
        ethPrice = +data.coin_price;
        lowGasPrice = +data.gas_prices.slow;
        averageGasPrice = +data.gas_prices.average;
        highGasPrice = +data.gas_prices.fast;
      }
    } catch(error) {
      console.error('Blockscout Gastracker Error: ', error);
      // SyntaxError in json parsing or TypeError due to undefined var:
      if (error instanceof SyntaxError || error instanceof TypeError) {
        ethPriceError = true;
      }
    }
  }

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
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="smiling face with sunglasses">😎</span>
              Low
            </p>
            <p className='text-lg tracking-wide text-green-600'>{ lowGasPriceGwei }</p>
            <p className='text-sm tracking-wide text-green-600'>{ lowGasPriceUsd }</p>
          </div>
          <div className='border border-(--border-color) rounded-lg my-4 md:my-0 px-16 py-4 w-58 ml-auto mr-auto'>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="beaming face with smiling eyes">😁</span>
              Average
            </p>
            <p className='text-lg tracking-wide text-blue-600'>{ averageGasPriceGwei }</p>
            <p className='text-sm tracking-wide text-blue-600'>{ averageGasPriceUsd }</p>
          </div>
          <div className='border border-(--border-color) rounded-lg px-16 py-4 w-58 ml-auto mr-auto'>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="flushed face">😳</span>
              High
            </p>
            <p className='text-lg tracking-wide text-red-600'>{ highGasPriceGwei }</p>
            <p className='text-sm tracking-wide text-red-600'>{ highGasPriceUsd }</p>
          </div>
        </div>
      </div>
    </main>
  );
}
