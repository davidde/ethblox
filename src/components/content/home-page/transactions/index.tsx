'use client';

import { useAlchemy } from '@/lib/utilities';
import { useDataState, DataState } from '@/lib/data-state';
import type { Alchemy, BlockWithTransactions } from 'alchemy-sdk';
import Transaction from './transaction';
import ErrorIndicator from '@/components/common/indicators/error-indicator';


export default function Transactions(props: {
  network: string,
  latestBlockData: DataState<number>,
}) {
  const alchemy = useAlchemy(props.network);

  const blockWithTransactionsData = useDataState<BlockWithTransactions, [Alchemy, number?]>({
    fetcher: (alchemy, num) => alchemy.core.getBlockWithTransactions(num!),
    args: [alchemy, props.latestBlockData.value],
  });

  let transactionsDisplay;
  if (props.latestBlockData.error) {
    transactionsDisplay = <ErrorIndicator
                            error='Error getting latest block'
                            className='pl-4 py-2'
                            refetch={props.latestBlockData.fetch}
                          />;
  } else if (blockWithTransactionsData.error) {
    transactionsDisplay = <ErrorIndicator
                            error='Error getting latest transactions'
                            className='pl-4 py-2'
                            refetch={blockWithTransactionsData.fetch}
                          />;
  } else {
    transactionsDisplay = [...Array(6)].map((_, i) =>
                            <Transaction
                              key={i}
                              id={i}
                              network={props.network}
                              blockWithTransactions={blockWithTransactionsData}
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