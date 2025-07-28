'use client';

import { useAlchemy } from '@/lib/utilities';
import { useDataState, DataState } from '@/lib/data-state';
import Transaction from './transaction';
import ErrorWithRefetch from '@/components/common/indicators/error-with-refetch';


export default function Transactions(props: {
  network: string,
  latestBlockData: DataState<number>,
}) {
  const alchemy = useAlchemy(props.network);

  const blockWithTransactions = useDataState({
      fetcher: (num) => alchemy.core.getBlockWithTransactions(num),
      args: [props.latestBlockData.value!],
      skipFetch: !props.latestBlockData.value
    });

  let transactionsDisplay;
  if (props.latestBlockData.error) {
    transactionsDisplay = <ErrorWithRefetch
                            error='Error getting latest block'
                            className='pl-4 py-2'
                            refetch={props.latestBlockData.refetch}
                          />;
  } else if (blockWithTransactions.error) {
    transactionsDisplay = <ErrorWithRefetch
                            error='Error getting latest transactions'
                            className='pl-4 py-2'
                            refetch={blockWithTransactions.refetch}
                          />;
  } else {
    transactionsDisplay = [...Array(6)].map((_, i) =>
                            <Transaction
                              key={i}
                              id={i}
                              network={props.network}
                              blockWithTransactions={blockWithTransactions}
                            />
                          );
  }
  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full md:w-[48%] max-w-xl md:min-w-132 mt-4 md:mt-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>
        Latest Transactions
      </h2>
      {
        transactionsDisplay
      }
    </div>
  );
}