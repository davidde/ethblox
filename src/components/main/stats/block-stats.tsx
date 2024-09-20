import { ClockIcon, CubeIcon } from '@heroicons/react/24/outline';


export default async function BlockStats() {
  return (
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
  );
}