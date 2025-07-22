'use client';

import Block from './block';
import ErrorIndicator from '@/components/common/error-indicator';


export default function Blocks(props: {
  blockNumber: number | undefined,
  network: string,
}) {
  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full md:w-[48%] max-w-xl md:min-w-132 my-4 md:my-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>Latest Blocks</h2>
      {
        props.blockNumber ?
          [...Array(5)].map((x, i) =>
            <Block
              key={i}
              blockNumber={props.blockNumber! - i - 1}
              network={props.network}
            />
          )
          :
          <ErrorIndicator error='Error getting latest blocks' className='block pl-4 py-2' />
      }
    </div>
  );
}