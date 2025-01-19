import { Utils } from 'alchemy-sdk';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';


export default async function Stats() {
  let EthSupply, Eth2Staking, BurntFees;
  let ethSupplyError = false;

  while (!EthSupply && !ethSupplyError) {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply2&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);
      const data = await response.json();
      ({ EthSupply, Eth2Staking, BurntFees } = data.result);
    } catch(error) {
      console.error('Etherscan Eth Supply Error: ', error);
      if (error instanceof SyntaxError) { // SyntaxError in json parsing
        ethSupplyError = true;
      }
    }
  }

  let totalTransactions, transactionsToday, ethPrice, averageGasPrice;
  let ethPriceError = false;

  while (!ethPrice && !ethPriceError) {
    try {
      const response = await fetch('https://eth.blockscout.com/api/v2/stats');
      const data = await response.json();
      totalTransactions = (+data.total_transactions).toLocaleString('en-US');
      transactionsToday = (+data.transactions_today).toLocaleString('en-US');
      ethPrice = +data.coin_price;
      averageGasPrice = +data.gas_prices.average;
    } catch(error) {
      console.error('Blockscout Transactions Stats Error: ', error);
      if (error instanceof SyntaxError) { // SyntaxError in json parsing
        ethPriceError = true;
      }
    }
  }

  const avgGasAmountPerTransfer = 21000;
  const gweiPrice = ethPrice ? (ethPrice / 1e9) : undefined;

  const averageGasPriceGwei = averageGasPrice ? averageGasPrice.toLocaleString('en-US', { maximumFractionDigits: 3 }) : '';
  const averageGasPriceUsd = averageGasPrice && gweiPrice ?
    (averageGasPrice * avgGasAmountPerTransfer * gweiPrice).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '';

  let supply = ethSupplyError ? null : +Utils.formatEther(EthSupply)
              + (+Utils.formatEther(Eth2Staking))
              - (+Utils.formatEther(BurntFees));

  let ethMarketCap, supplyFormatted, ethPriceFormatted;
  if (supply && ethPrice) {
    ethMarketCap = (supply * ethPrice)
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
    supplyFormatted = supply.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
    ethPriceFormatted = ethPrice.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }

  return (
    <div className='border-2 border-[var(--border-color)] bg-[var(--main-bg-color)]
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
            {`Ξ${supplyFormatted}`}
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
            className='pl-12 hover:text-[var(--hover-fg-color)] dark:hover:text-[var(--inverse-bg-color-lighter)]'
          >
            {averageGasPriceGwei} gwei (${averageGasPriceUsd})
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