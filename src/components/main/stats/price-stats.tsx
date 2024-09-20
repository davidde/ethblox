import { Utils } from 'alchemy-sdk';
import { GlobeAltIcon } from '@heroicons/react/24/outline';


export default async function PriceStats() {
  let price, supply;

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd',
      { next: { revalidate: 60 }} // Revalidate cache every minute
    );
    const data = await response.json();
    price = data.ethereum;
  } catch(error) {
    console.error('Coingecko Eth Price Error: ', error);
  }

  try {
    const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply2&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);
    const data = await response.json();
    const { EthSupply, Eth2Staking, BurntFees } = data.result;
    supply = Number(Utils.formatEther(EthSupply))
                        + Number(Utils.formatEther(Eth2Staking))
                        - Number(Utils.formatEther(BurntFees));
  } catch(error) {
    console.error('Etherscan Eth Supply Error: ', error);
  }

  let ethPrice, ethMarketCap;
  ethPrice = {
    eur: price.eur.toLocaleString('en-US',
          {
            style: 'currency',
            currency: 'EUR',
          }),
    usd: price.usd.toLocaleString('en-US',
          {
            style: 'currency',
            currency: 'USD',
          }),
  };
  if (supply) {
    ethMarketCap = {
      eur: (supply * price.eur)
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'EUR',
            }),
      usd: (supply * price.usd)
            .toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            }),
    };
    supply = supply.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  }

  return (
    <>
      <div>
        <div className='flex mb-4'>
          <div>
            <div className='w-8 h-8 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center' />
          </div>
          <div className='ml-4'>
            <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER PRICE</p>
            <p>{ ethPrice ? `${ethPrice.eur} / ${ethPrice.usd}` : '' }</p>
          </div>
        </div>

        <div className='ml-12'>
          <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER SUPPLY</p>
          <p>{`Ξ${supply}`}</p>
        </div>
      </div>

      <div className='flex my-6'>
        <div>
          <GlobeAltIcon className='w-8 h-8' />
        </div>
        <div className='ml-4'>
          <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>MARKET CAP (= price * supply)</p>
          {
            ethMarketCap ?
            <div className='font-mono'>
              <p className='mb-4'>{ethMarketCap.eur}</p>
              <p>{ethMarketCap.usd}</p>
            </div> : ''
          }
        </div>
      </div>
    </>
  );
}