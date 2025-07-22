'use client';

import { useEffect, useState } from 'react';
import { getAlchemy } from '@/lib/utilities';
import DataState from '@/lib/data-state';
import Transaction from './transaction';
import ErrorIndicator from '@/components/common/error-indicator';
import { BlockWithTransactions } from 'alchemy-sdk';


export default function Transactions(props: {
  blockNumber: number | undefined,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const [blockWithTransactions, setBlockWithTransactions] = useState(DataState.value<BlockWithTransactions>());

  useEffect(() => {
    (async () => {
      try {
        const resp = await alchemy.core.getBlockWithTransactions(props.blockNumber!);
        setBlockWithTransactions(DataState.value(resp));
      } catch(err) {
        setBlockWithTransactions(DataState.error(err));
      }
    })();
  }, [alchemy, props.blockNumber]);

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full md:w-[48%] max-w-xl md:min-w-132 mt-4 md:mt-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>
        Latest Transactions
      </h2>
      {
        blockWithTransactions.value ?
          blockWithTransactions.value.transactions.map((transaction, i) => {
            if (i < 6)
              return (
                <Transaction
                  key={i}
                  transaction={transaction}
                  network={props.network}
                />
              );
          })
          :
          <ErrorIndicator error='Error getting latest transactions' className='block pl-4 py-2' />
      }
    </div>
  );
}