import { Alchemy } from 'alchemy-sdk';
import BlockSkeleton from './block-skeleton';


export default function BlocksSkeleton() {
  return (
    <div className='border-2 border-[var(--border-color)] bg-[var(--comp-bg-color)] rounded-lg w-full md:w-[48%] max-w-[36rem] md:min-w-[33rem] my-4 md:my-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b-2 border-[var(--border-color)]'>Latest Blocks</h2>
      {
        new Array(4).map((i) => <BlockSkeleton key={i} /> )
      }
    </div>
  );
}