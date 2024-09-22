import { CubeIcon } from '@heroicons/react/24/outline';
import { Alchemy } from 'alchemy-sdk';


type Props = {
  blockNumber: number | undefined,
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {
  let block;
  let secsSinceAdded;

  try {
    if (props.blockNumber) block = await props.alchemy.core.getBlock(props.blockNumber);
  } catch(error) {
    console.error('getBlock() Error: ', error);
  }

  if (block) {
    secsSinceAdded = Math.round(Date.now() / 1000 - block.timestamp);
    
  }

  return (
    <div className='p-1 md:p-3 border-b border-[var(--border-color)]'>
      <div className='flex'>
        <CubeIcon className='w-8 h-8' />
        <div className='flex md:flex-col pt-1 md:pt-0'>
          <span className='px-2 md:px-4 leading-5'>{props.blockNumber}</span>
          <span className='md:pl-4 text-sm text-[var(--grey-fg-color)]'>{secsSinceAdded} secs ago</span>
        </div>
      </div>
    </div>
  );
}