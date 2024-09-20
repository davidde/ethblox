import { Square3Stack3DIcon, DocumentTextIcon } from '@heroicons/react/24/outline';


export default async function TransactionStats() {
  return (
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
  );
}