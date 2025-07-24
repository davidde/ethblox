'use client';

import { useEffect, useState } from 'react';
import { getAlchemy } from '@/lib/utilities';
import DataState from '@/lib/data-state';
import Transaction from './transaction';
import { BlockWithTransactions } from 'alchemy-sdk';
import ErrorWithRetry from '@/components/common/indicators/error-with-retry';


export default function Transactions(props: {
  latestBlockData: DataState<number>,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const [blockWithTransactions, setBlockWithTransactions] = useState(DataState.value<BlockWithTransactions>());

  async function getBlockWithTransactions() {
    if (props.latestBlockData.value) try {
      const resp = await alchemy.core.getBlockWithTransactions(props.latestBlockData.value!);
      setBlockWithTransactions(DataState.value(resp));
    } catch(err) {
      setBlockWithTransactions(DataState.error(err));
    }
  }

  useEffect(() => {
    getBlockWithTransactions();
  }, [alchemy, props.latestBlockData]);

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full md:w-[48%] max-w-xl md:min-w-132 mt-4 md:mt-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>
        Latest Transactions
      </h2>
      {
        blockWithTransactions.error ?
          <ErrorWithRetry
            error='Error getting latest transactions'
            className='pl-4 py-2'
            retry={getBlockWithTransactions}
          />
          :
          [...Array(6)].map((_, i) =>
                <Transaction
                  key={i}
                  id={i}
                  network={props.network}
                  blockWithTransactions={blockWithTransactions}
                />
          )
      }
    </div>
  );
}