import { Utils } from 'alchemy-sdk';
import { GlobeAltIcon } from '@heroicons/react/24/outline';


export default async function PriceStats() {
  let price; // Num
  let ethPrice, ethMarketCap; // Localestrings

  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd',
      { next: { revalidate: 60 }} // Revalidate cache every minute
    );
    const data = await response.json();
    price = data.ethereum;
    ethPrice = {
      eur: price.eur.toLocaleString("en-US",
            {
              style: "currency",
              currency: "EUR",
            }),
      usd: price.usd.toLocaleString("en-US",
            {
              style: "currency",
              currency: "USD",
            }),
    };
  } catch(error) {
    console.error('Coingecko Eth Price Error: ', error);
  }

  try {
    const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply2&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);
    const data = await response.json();
    const { EthSupply, Eth2Staking, BurntFees } = data.result;
    const totalSupply = Number(Utils.formatEther(EthSupply))
                        + Number(Utils.formatEther(Eth2Staking))
                        - Number(Utils.formatEther(BurntFees));
    ethMarketCap = {
      eur: (totalSupply * price.eur)
            .toLocaleString("en-US", {
              style: "currency",
              currency: "EUR",
            }),
      usd: (totalSupply * price.usd)
            .toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }),
    };
  } catch(error) {
    console.error('Etherscan Eth Supply Error: ', error);
  }

  return (
    <div>
      <div className='flex mb-4'>
        <div>
          <div className={`w-8 h-8 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center`} />
        </div>
        <div className='ml-4'>
          <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER PRICE</p>
          <p>{ ethPrice ? `${ethPrice.eur} / ${ethPrice.usd}` : '' }</p>
        </div>
      </div>

      <div className='flex mb-4'>
        <div>
          <GlobeAltIcon className='w-8 h-8' />
        </div>
        <div className='ml-4'>
          <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>MARKET CAP</p>
          {
            ethMarketCap ?
            <div className='font-mono'>
              <p>{ethMarketCap.eur}</p>
              <p>{ethMarketCap.usd}</p>
            </div> : ''
          }
        </div>
      </div>
    </div>
  );
}