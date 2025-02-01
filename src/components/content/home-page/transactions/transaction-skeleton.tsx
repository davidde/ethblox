import { DocumentTextIcon } from '@heroicons/react/24/outline';


export default function TransactionSkeleton() {
  return (
    <div className='p-2 md:p-3 border-b border-[var(--border-color)] last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <DocumentTextIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex flex-col ml-2 pt-1 md:pt-0 md:w-48'>
            <span className='px-2 md:px-4'>
              &nbsp;
            </span>
            <span className='px-2 md:pl-4'>Amount: </span>
          </div>
        </div>
        <div className='flex flex-col ml-12 md:ml-4 my-2 md:my-0'>
          <span className='pl-2 md:pl-4'>
            From:&nbsp;

          </span>
          <span className='pl-7 md:pl-9'>
            To:&nbsp;

          </span>
        </div>
      </div>
    </div>
  );
}