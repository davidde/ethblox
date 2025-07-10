import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


export default async function Stats() {
  let { ethSupply, ethSupplyError } = await getEthSupply();
  let {
    ethPrice,
    averageGasPrice,
    transactionsToday,
    totalTransactions,
    ethPriceError
  } = await getPriceAndTransactions();

  const avgGasAmountPerTransfer = 21000;
  const gweiPrice = ethPrice ? (ethPrice / 1e9) : undefined;

  const averageGasPriceGwei = averageGasPrice ? averageGasPrice.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '';
  const averageGasPriceUsd = averageGasPrice && gweiPrice ?
    (averageGasPrice * avgGasAmountPerTransfer * gweiPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  let ethPriceFormatted, ethSupplyFormatted, ethMarketCap;
  ethPriceFormatted = ethPrice?.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  if (ethSupply) {
    ethSupplyFormatted = `Ξ${ethSupply.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    })}`;
  }
  if (ethPrice && ethSupply) {
    ethMarketCap = (ethPrice * ethSupply)
        .toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        });
  }

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full max-w-xl md:max-w-300 my-4 md:my-8 md:mr-12'>
      <div className='flex flex-col md:flex-row justify-between'>
        <div className='w-56 md:w-[calc(100%/3)] pl-4 py-4 md:border-b border-(--border-color)'>
          <div className='flex'>
            <CurrencyDollarIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>ETHER PRICE</p>
          </div>
          <div className='pl-12'>
            {ethPriceFormatted || (ethPriceError ?
                                  <ErrorIndicator error='Error' />
                                  :
                                  <LoadingIndicator />)}
          </div>
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] py-0 md:py-4 md:border-b md:border-x border-(--border-color)'>
          <div className='flex'>
            <div className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>ETHER SUPPLY</p>
          </div>
          <div className='pl-12'>
            { ethSupplyFormatted || (ethSupplyError ?
                                  <ErrorIndicator error='Error' />
                                  :
                                  <LoadingIndicator />)}
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4 md:border-b border-(--border-color)'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <GlobeAltIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>ETHER MARKET CAP</p>
            </div>
            <div className='pl-12'>
              {ethMarketCap || ((ethPriceError || ethSupplyError) ?
                                <ErrorIndicator error='Error' />
                                :
                                <LoadingIndicator />)}
            </div>
          </div>
        </div>
      </div>

      <div className='flex flex-col md:flex-row justify-between'>
        <div className='w-56 md:w-[calc(100%/3)] pl-4 py-0 md:py-4'>
          <div className='flex'>
          <FireIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>AVERAGE GAS PRICE</p>
          </div>
          {
            averageGasPriceUsd ?
            <Link
              href='/mainnet/gastracker'
              className='pl-12 text-(--link-color) hover:text-(--hover-fg-color)'
            >
              {`${averageGasPriceGwei} gwei ($${averageGasPriceUsd})`}
            </Link>
            :
            (ethPriceError ?
                <ErrorIndicator error='Error' className='pl-12' />
                :
                <LoadingIndicator className='pl-12' />)
          }
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] pt-4 md:py-4 md:border-x border-(--border-color)'>
          <div className='flex'>
          <ClipboardDocumentListIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>TRANSACTIONS TODAY</p>
          </div>
          <div className='pl-12'>
            {transactionsToday || (ethPriceError ?
                                  <ErrorIndicator error='Error' />
                                  :
                                  <LoadingIndicator />)}
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <Square3Stack3DIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>TOTAL TRANSACTIONS</p>
            </div>
            <div className='pl-12'>
              {totalTransactions || (ethPriceError ?
                                    <ErrorIndicator error='Error' />
                                    :
                                    <LoadingIndicator />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function getEthSupply() {
  let ethSupply, ethSupplyError;

  try {
    const supplyResponse = await fetch('https://eth.blockscout.com/api/v2/stats/charts/market');
    if (supplyResponse.status === 200) {
      const supplyData = await supplyResponse.json();
      ethSupply = +supplyData.available_supply;
    } else {
      ethSupplyError = `Blockscout Supply Stats Response NOT OK, status: ${supplyResponse.status}`;
      console.error(ethSupplyError);
    }
  } catch(error) {
    ethSupplyError = 'Blockscout Supply Stats' + error;
    console.error(ethSupplyError);
  }

  return { ethSupply, ethSupplyError };
}

async function getPriceAndTransactions() {
  let totalTransactions, transactionsToday, ethPrice, averageGasPrice;
  let ethPriceError;

  try {
    const statsResponse = await fetch('https://eth.blockscout.com/api/v2/stats');
    if (statsResponse.status === 200) {
      const statsData = await statsResponse.json();
      totalTransactions = (+statsData.total_transactions).toLocaleString('en-US');
      transactionsToday = (+statsData.transactions_today).toLocaleString('en-US');
      ethPrice = +statsData.coin_price;
      averageGasPrice = +statsData.gas_prices.average;
    } else {
      ethPriceError = `Blockscout Price/Transaction Stats Response NOT OK, status: ${statsResponse.status}`;
      console.error(ethPriceError);
    }
  } catch(error) {
    ethPriceError = 'Blockscout Price/Transaction Stats' + error;
    console.error(ethPriceError);
  }

  return {
    ethPrice,
    averageGasPrice,
    transactionsToday,
    totalTransactions,
    ethPriceError
  };
}
