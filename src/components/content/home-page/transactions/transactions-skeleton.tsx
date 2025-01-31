import { Alchemy } from 'alchemy-sdk';
import TransactionSkeleton from './transaction-skeleton';


export default function TransactionsSkeleton() {
  return (
    <div className='border-2 border-[var(--border-color)] bg-[var(--comp-bg-color)]
                    rounded-lg w-full md:w-[48%] max-w-[36rem] md:min-w-[33rem] mt-4 md:mt-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b-2 border-[var(--border-color)]'>Latest Transactions</h2>
      {
        new Array(6).map((i) => {
          if (i < 6)
            return (
              <TransactionSkeleton key={i} />
            );
        })
      }
    </div>
  );
}