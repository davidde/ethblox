import { CubeIcon } from '@heroicons/react/24/outline';


export default function BlockSkeleton() {
  return (
    <div className='p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <CubeIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex md:flex-col ml-2 pt-1 md:pt-0 md:w-32'>
            <span className='px-2 md:px-4 leading-5'>
              &nbsp;
            </span>
            <span className='md:pl-4 text-sm text-(--grey-fg-color)'>( secs ago)</span>
          </div>
        </div>
        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'> transactions</span>
          <span className='pl-2 md:pl-4'>
            Block Reward: 
          </span>
          <span className='pl-2 md:pl-4 leading-5'>
            Recipient:&nbsp;

          </span>
        </div>
      </div>
    </div>
  );
}