import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


export default async function Stats() {
  let ethSupply;
  let ethSupplyError = false;

  while (!ethSupply && !ethSupplyError) {
    try {
      let supplyResponse = await fetch('https://eth.blockscout.com/api/v2/stats/charts/market');
      if (supplyResponse.status === 200) {
        let supplyData = await supplyResponse.json();
        ethSupply = +supplyData.available_supply;
      }
    } catch(error) {
      console.error('Blockscout Supply Stats Error: ', error);
      // SyntaxError in json parsing or TypeError due to undefined var:
      if (error instanceof SyntaxError || error instanceof TypeError) {
        ethSupplyError = true;
      }
    }
  }

  let totalTransactions, transactionsToday, ethPrice, averageGasPrice;
  let ethPriceError = false;

  let statsData, statsResponse;
  while (!ethPrice && !ethPriceError) {
    try {
      statsResponse = await fetch('https://eth.blockscout.com/api/v2/stats');
      if (statsResponse.status === 200) {
        statsData = await statsResponse.json();
        totalTransactions = (+statsData.total_transactions).toLocaleString('en-US');
        transactionsToday = (+statsData.transactions_today).toLocaleString('en-US');
        ethPrice = +statsData.coin_price;
        averageGasPrice = +statsData.gas_prices.average;
      }
    } catch(error) {
      console.error('Blockscout Transactions Stats Error: ', error);
      console.log('Blockscout response object = ', statsResponse);
      console.log('Blockscout data object = ', statsData);
      // SyntaxError in json parsing or TypeError due to undefined var:
      if (error instanceof SyntaxError || error instanceof TypeError) {
        ethPriceError = true;
      }
    }
  }

  const avgGasAmountPerTransfer = 21000;
  const gweiPrice = ethPrice ? (ethPrice / 1e9) : undefined;

  const averageGasPriceGwei = averageGasPrice ? averageGasPrice.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '';
  const averageGasPriceUsd = averageGasPrice && gweiPrice ?
    (averageGasPrice * avgGasAmountPerTransfer * gweiPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  let ethMarketCap, supplyFormatted, ethPriceFormatted;
  if (ethSupply && ethPrice) {
    ethMarketCap = (ethSupply * ethPrice)
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
    supplyFormatted = ethSupply.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    ethPriceFormatted = ethPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  return (
    <div className='border-2 border-[var(--border-color)] bg-[var(--comp-bg-color)]
                    rounded-lg w-full max-w-[36rem] md:max-w-[75rem] my-4 md:my-8 md:mr-12'>
      <div className='flex flex-col md:flex-row justify-between'>
        <div className='w-56 md:w-[calc(100%/3)] pl-4 py-4 md:border-b border-[var(--border-color)]'>
          <div className='flex'>
            <CurrencyDollarIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER PRICE</p>
          </div>
          <div className='pl-12'>
            {ethPriceFormatted}
          </div>
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] py-0 md:py-4 md:border-b md:border-x border-[var(--border-color)]'>
          <div className='flex'>
            <div className='w-8 h-8 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER SUPPLY</p>
          </div>
          <div className='pl-12'>
            { supplyFormatted ? `Ξ${supplyFormatted}` : '' }
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4 md:border-b border-[var(--border-color)]'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <GlobeAltIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER MARKET CAP</p>
            </div>
            <div className='pl-12'>
              {ethMarketCap}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <div className='w-56 md:w-[calc(100%/3)] pl-4 py-0 md:py-4'>
          <div className='flex'>
          <FireIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>AVERAGE GAS PRICE</p>
          </div>
          <Link
            href='/mainnet/gastracker'
            className={`pl-12 text-[var(--link-color)] hover:text-[var(--hover-fg-color)] ` +
                      `${averageGasPriceUsd ? '' : 'hidden'}`}
          >
            { averageGasPriceUsd ? `${averageGasPriceGwei} gwei ($${averageGasPriceUsd})` : '' }
          </Link>
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] pt-4 md:py-4 md:border-x border-[var(--border-color)]'>
          <div className='flex'>
          <ClipboardDocumentListIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>TRANSACTIONS TODAY</p>
          </div>
          <div className='pl-12'>
            {transactionsToday}
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <Square3Stack3DIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>TOTAL TRANSACTIONS</p>
            </div>
            <div className='pl-12'>
              {totalTransactions}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}