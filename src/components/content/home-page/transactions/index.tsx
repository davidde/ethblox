'use client';

import { useCallback, useEffect, useState } from 'react';
import { getAlchemy } from '@/lib/utilities';
import DataState from '@/lib/data-state';
import Transaction from './transaction';
import { BlockWithTransactions } from 'alchemy-sdk';
import ErrorWithRetry from '@/components/common/indicators/error-with-retry';


export default function Transactions(props: {
  network: string,
  latestBlockData: DataState<number>,
  refetch: () => Promise<void>,
}) {
  const alchemy = getAlchemy(props.network);
  const [blockWithTransactions, setBlockWithTransactions] = useState(DataState.value<BlockWithTransactions>());

  const getBlockWithTransactions = useCallback(async () => {
    if (props.latestBlockData.value) try {
      const resp = await alchemy.core.getBlockWithTransactions(props.latestBlockData.value);
      setBlockWithTransactions(DataState.value(resp));
    } catch(err) {
      setBlockWithTransactions(DataState.error(err));
    }
  }, [alchemy, props.latestBlockData.value]);

  useEffect(() => {
    getBlockWithTransactions();
  }, [getBlockWithTransactions]);

  let transactionsDisplay;
  if (props.latestBlockData.error) {
    transactionsDisplay = <ErrorWithRetry
                            error='Error getting latest block'
                            className='pl-4 py-2'
                            refetch={props.refetch}
                          />;
  } else if (blockWithTransactions.error) {
    transactionsDisplay = <ErrorWithRetry
                            error='Error getting latest transactions'
                            className='pl-4 py-2'
                            refetch={getBlockWithTransactions}
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