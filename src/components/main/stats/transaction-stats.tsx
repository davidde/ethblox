import { Square3Stack3DIcon } from '@heroicons/react/24/outline';


export default async function TransactionStats() {
  let totalTransactions, transactionsToday, ethPrice;
  let lowGasPrice, averageGasPrice, highGasPrice;

  try {
    const response = await fetch('https://eth.blockscout.com/api/v2/stats');
    const data = await response.json();
    totalTransactions = (+data.total_transactions).toLocaleString('en-US');
    transactionsToday = (+data.transactions_today).toLocaleString('en-US');
    ethPrice = +data.coin_price;
    lowGasPrice = +data.gas_prices.slow;
    averageGasPrice = +data.gas_prices.average;
    highGasPrice = +data.gas_prices.fast;
  } catch(error) {
    console.error('Blockscout Transactions Error: ', error);
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
    <div className='border-2 border-[var(--border-color)]
                    rounded-lg w-full md:w-[50%] md:ml-12 my-4 md:my-8'>
      <div className='flex mb-4 border-b-2 border-[var(--border-color)]'>
        <div>
          <Square3Stack3DIcon className='w-8 h-8 mt-1 md:mt-2' />
        </div>
        <div className='ml-4'>
          <h2 className='font-bold py-2 md:py-3'>
            Transaction Stats
          </h2>
        </div>
      </div>

      <div className='pl-4 pb-2 border-b border-[var(--border-color)]'>
        <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>TOTAL TRANSACTIONS</p>
        <p>{ totalTransactions }</p>
      </div>

      <div className='pl-4 pt-4 pb-2 border-b border-[var(--border-color)]'>
        <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>TRANSACTIONS TODAY</p>
        <p>{ transactionsToday }</p>
      </div>

      <div className='px-4 pt-4 pb-2'>
        <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>GAS TRACKER</p>
        <div className='flex flex-col md:flex-row items-start justify-between w-full mt-2'>
          <div>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="smiling face with sunglasses">😎</span>
              Low
            </p>
            <p className='text-lg tracking-wide text-green-600'>{ lowGasPriceGwei } gwei</p>
            <p className='text-sm tracking-wide text-green-600'>(${ lowGasPriceUsd })</p>
          </div>
          <div className='my-4 md:my-0'>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="beaming face with smiling eyes">😁</span>
              Average
            </p>
            <p className='text-lg tracking-wide text-blue-600'>{ averageGasPriceGwei } gwei</p>
            <p className='text-sm tracking-wide text-blue-600'>(${ averageGasPriceUsd })</p>
          </div>
          <div>
            <p className='font-bold'>
              <span className='text-xl mr-2' role="img" aria-label="flushed face">😳</span>
              High
            </p>
            <p className='text-lg tracking-wide text-red-600'>{ highGasPriceGwei } gwei</p>
            <p className='text-sm tracking-wide text-red-600'>(${ highGasPriceUsd })</p>
          </div>
        </div>
      </div>
    </div>
  );
}