'use client';

import DataState from '@/lib/data-state';
import Block from './block';
import ErrorIndicator from '@/components/common/error-indicator';


export default function Blocks(props: {
  blockNumber: DataState<number>,
  network: string,
}) {
  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full md:w-[48%] max-w-xl md:min-w-132 my-4 md:my-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>Latest Blocks</h2>
      {
        props.blockNumber.error ?
          <ErrorIndicator error='Error getting latest blocks' className='block pl-4 py-2' />
          :
          [...Array(5)].map((x, i) =>
            <Block
              key={i}
              blockNumber={props.blockNumber.value! - i - 1}
              network={props.network}
            />
          )
      }
    </div>
  );
}