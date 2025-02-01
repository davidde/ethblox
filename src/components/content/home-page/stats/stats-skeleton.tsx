import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { Square3Stack3DIcon } from '@heroicons/react/24/outline';
import { FireIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';


export default function StatsSkeleton() {
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
            &nbsp;
          </div>
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] py-0 md:py-4 md:border-b md:border-x border-[var(--border-color)]'>
          <div className='flex'>
            <div className='w-8 h-8 bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-center' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER SUPPLY</p>
          </div>
          <div className='pl-12'>
            &nbsp;
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4 md:border-b border-[var(--border-color)]'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <GlobeAltIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>ETHER MARKET CAP</p>
            </div>
            <div className='pl-12'>
              &nbsp;
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
            &nbsp;
        </div>

        <div className='w-56 md:w-[calc(100%/3)] pl-4 md:pl-[calc(100%/18)] pt-4 md:py-4 md:border-x border-[var(--border-color)]'>
          <div className='flex'>
          <ClipboardDocumentListIcon className='w-8 h-8' />
            <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>TRANSACTIONS TODAY</p>
          </div>
          <div className='pl-12'>
            &nbsp;
          </div>
        </div>

        <div className='w-60 md:w-[calc(100%/3)] px-4 py-4'>
          <div className='block w-60 ml-auto mr-auto'>
            <div className='flex'>
              <Square3Stack3DIcon className='w-8 h-8' />
              <p className='pt-2 pl-4 text-xs tracking-wider text-[var(--grey-fg-color)]'>TOTAL TRANSACTIONS</p>
            </div>
            <div className='pl-12'>
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}