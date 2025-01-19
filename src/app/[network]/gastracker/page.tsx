import NotFoundPage from '@/components/content/error-page/not-found-page';
import { ChartBarIcon } from '@heroicons/react/24/outline';


export default async function Page({params} : {params: Promise<{network: string}>})
{
  const network = (await params).network;
  if (network !== 'mainnet') {
    return <NotFoundPage reason={`There only exists a Gas Tracker for Ethereum Mainnet.`} />;
  }

  let ethPrice, lowGasPrice, averageGasPrice, highGasPrice;
  let ethPriceError = false;

  while (!ethPrice && !ethPriceError) {
    try {
      const response = await fetch('https://eth.blockscout.com/api/v2/stats');
      const data = await response.json();
      ethPrice = +data.coin_price;
      lowGasPrice = +data.gas_prices.slow;
      averageGasPrice = +data.gas_prices.average;
      highGasPrice = +data.gas_prices.fast;
    } catch(error) {
      console.error('Blockscout Gastracker Error: ', error);
      if (error instanceof SyntaxError) { // SyntaxError in json parsing
        ethPriceError = true;
      }
    }
  }

  const avgGasAmountPerTransfer = 21000;
  const gweiPrice = ethPrice ? (ethPrice / 1e9) : undefined;
  const lowGasPriceGwei = lowGasPrice ? lowGasPrice.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '';
  const lowGasPriceUsd = lowGasPrice && gweiPrice ?
    (lowGasPrice * avgGasAmountPerTransfer * gweiPrice ).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  const averageGasPriceGwei = averageGasPrice ? averageGasPrice.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '';
  const averageGasPriceUsd = averageGasPrice && gweiPrice ?
    (averageGasPrice * avgGasAmountPerTransfer * gweiPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  const highGasPriceGwei = highGasPrice ? highGasPrice.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '';
  const highGasPriceUsd = highGasPrice && gweiPrice ?
    (highGasPrice * avgGasAmountPerTransfer * gweiPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  return (
    <main>
      <div className='flex flex-col items-center py-4 pr-16'>
        <div className='flex py-10'>
          <ChartBarIcon className='w-8 h-8' />
          <p className='pt-1 pl-4 text-lg tracking-wider'>ETHEREUM GAS TRACKER</p>
        </div>
        <div className='flex flex-col md:flex-row items-start justify-between w-full max-w-[50rem] mt-2'>
          <div className='border border-[var(--border-color)] rounded-lg md:px-16 md:py-4'>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="smiling face with sunglasses">😎</span>
              Low
            </p>
            <p className='text-lg tracking-wide text-green-600'>{ lowGasPriceGwei } gwei</p>
            <p className='text-sm tracking-wide text-green-600'>(${ lowGasPriceUsd })</p>
          </div>
          <div className='border border-[var(--border-color)] rounded-lg my-4 md:my-0 md:px-16 md:py-4'>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="beaming face with smiling eyes">😁</span>
              Average
            </p>
            <p className='text-lg tracking-wide text-blue-600'>{ averageGasPriceGwei } gwei</p>
            <p className='text-sm tracking-wide text-blue-600'>(${ averageGasPriceUsd })</p>
          </div>
          <div className='border border-[var(--border-color)] rounded-lg md:px-16 md:py-4'>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="flushed face">😳</span>
              High
            </p>
            <p className='text-lg tracking-wide text-red-600'>{ highGasPriceGwei } gwei</p>
            <p className='text-sm tracking-wide text-red-600'>(${ highGasPriceUsd })</p>
          </div>
        </div>
      </div>
    </main>
  );
}