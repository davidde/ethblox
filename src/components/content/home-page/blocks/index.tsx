'use client';

import { DataState } from '@/lib/data-state';
import Block from './block';
import ErrorIndicator from '@/components/common/indicators/error-indicator';


export default function Blocks(props: {
  network: string,
  latestBlockData: DataState<number>,
}) {
  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    shadow-xl/20 dark:shadow-[#3a3a3a] rounded-lg
                    w-full md:w-[48%] max-w-xl md:min-w-132 my-4 md:my-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>Latest Blocks</h2>
      {
        props.latestBlockData.error ?
          <ErrorIndicator
            error='Error getting latest block'
            className='pl-4 py-2'
            refetch={props.latestBlockData.fetch}
          />
          :
          [...Array(5)].map((_, i) =>
            <Block
              key={i}
              id={i}
              latestBlockData={props.latestBlockData}
              network={props.network}
            />
          )
      }
    </div>
  );
}