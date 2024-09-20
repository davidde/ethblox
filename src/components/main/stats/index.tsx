import { GlobeAltIcon, Square3Stack3DIcon, ClockIcon, CubeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';


export default async function Stats() {
  let ethPrice;

  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
    const data = await response.json();
    ethPrice = data.ethereum;
  } catch(error) {
    console.error('getPrice() Error: ', error);
  }

  return (
    <div className={`flex flex-col md:flex-row items-center justify-between
      border-2 border-[var(--border-color)]
      rounded-lg w-full md:w-[90%] p-1 md:p-3 my-8 md:my-16`}>
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

      <div>
        <div className='flex mb-4'>
          <div>
            <Square3Stack3DIcon className='w-8 h-8' />
          </div>
          <div className='ml-4'>
            <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>TRANSACTIONS</p>
            <p>{  }</p>
          </div>
        </div>
        <div className='flex mb-4'>
          <div>
            <DocumentTextIcon className='w-8 h-8' />
          </div>
          <div className='ml-4'>
            <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>MED GAS PRICE</p>
            <p>{  }</p>
          </div>
        </div>
      </div>

      <div>
        <div className='flex mb-4'>
          <div>
            <ClockIcon className='w-8 h-8' />
          </div>
          <div className='ml-4'>
            <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>LAST FINALIZED BLOCK</p>
            <p>{  }</p>
          </div>
        </div>
        <div className='flex mb-4'>
          <div>
            <CubeIcon className='w-8 h-8' />
          </div>
          <div className='ml-4'>
            <p className='text-xs tracking-wider text-[var(--grey-fg-color)]'>LAST SAFE BLOCK</p>
            <p>{  }</p>
          </div>
        </div>
      </div>
    </div>
  );
}