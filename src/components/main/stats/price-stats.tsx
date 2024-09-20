import { GlobeAltIcon } from '@heroicons/react/24/outline';


export default async function PriceStats() {
  let ethPrice;

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
    const data = await response.json();
    ethPrice = data.ethereum;
  } catch(error) {
    console.error('getPrice() Error: ', error);
  }

  return (
    <div>
      <div className='flex mb-4'>
        <div>
          <div className={`w-8 h-8 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center`} />
        </div>
        <div className='ml-4'>
          <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER PRICE</p>
          <p>{ ethPrice ? `€${ethPrice.eur} / $${ethPrice.usd}` : '' }</p>
        </div>
      </div>

      <div className='flex mb-4'>
        <div>
          <GlobeAltIcon className='w-8 h-8' />
        </div>
        <div className='ml-4'>
          <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>MARKET CAP</p>
          <p>{  }</p>
        </div>
      </div>
    </div>
  );
}