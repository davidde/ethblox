import { Utils } from 'alchemy-sdk';


export default async function PriceStats() {
  let price, EthSupply, Eth2Staking, BurntFees;

  while (!price) {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd',
        // { next: { revalidate: 60 }} // Revalidate cache every minute
      );
      const data = await response.json();
      price = data.ethereum;
    } catch(error) {
      console.error('Coingecko Eth Price Error: ', error);
    }
  }

  while (!EthSupply) {
    try {
      const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply2&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);
      const data = await response.json();
      ({ EthSupply, Eth2Staking, BurntFees } = data.result);
    } catch(error) {
      console.error('Etherscan Eth Supply Error: ', error);
    }
  }

  let supply = +Utils.formatEther(EthSupply)
              + (+Utils.formatEther(Eth2Staking))
              - (+Utils.formatEther(BurntFees));

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

  let supplyFormatted;
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
    supplyFormatted = supply.toLocaleString('en-US', {
      maximumFractionDigits: 2,
    });
  }

  return (
    <div className='border-2 border-[var(--border-color)]
                    rounded-lg w-full md:w-[30%] max-w-[20rem] min-w-[17rem] my-4 md:my-8 md:h-[19.5rem]'>
      <div className='flex mb-4 border-b-2 border-[var(--border-color)]'>
        <div>
          <div className='w-8 h-8 mt-1 md:mt-2 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center' />
        </div>
        <div className='ml-4'>
          <h2 className='font-bold py-2 md:py-3'>
            Ξther Stats
          </h2>
        </div>
      </div>

      <div className='pl-4 pb-2 border-b border-[var(--border-color)]'>
        <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER PRICE</p>
        {
          ethPrice ?
          <div>
            <p>{ethPrice.eur}</p>
            <p>{ethPrice.usd}</p>
          </div> : ''
        }
      </div>

      <div className='pl-4 pt-4 pb-2 border-b border-[var(--border-color)]'>
        <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER SUPPLY</p>
        <p>{`Ξ${supplyFormatted}`}</p>
      </div>

      <div className='pl-4 pt-4 pb-2'>
        <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER MARKET CAP (= price * supply)</p>
        {
          ethMarketCap ?
          <div>
            <p>{ethMarketCap.eur}</p>
            <p>{ethMarketCap.usd}</p>
          </div> : ''
        }
      </div>
    </div>
  );
}