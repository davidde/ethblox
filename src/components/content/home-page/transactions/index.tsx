import { Alchemy } from 'alchemy-sdk';
import Transaction from './transaction';
import ErrorIndicator from '@/components/common/error-indicator';


type Props = {
  blockNumber: number | undefined,
  network: string,
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {
  let blockWithTransactions;

  try {
    blockWithTransactions = await props.alchemy.core.getBlockWithTransactions(props.blockNumber!);
  } catch(error) {
    console.error('getBlockNumber() Error: ', error);
  }

  return (
    <div className='border border-(--border-color) bg-(--comp-bg-color)
                    rounded-lg w-full md:w-[48%] max-w-xl md:min-w-132 mt-4 md:mt-8 md:mr-12'>
      <h2 className='text-[1.15rem] font-bold p-2 pl-4 md:p-3 md:pl-4 border-b border-(--border-color)'>
        Latest Transactions
      </h2>
      {
        blockWithTransactions ?
          blockWithTransactions.transactions.map((transaction, i) => {
            if (i < 6)
              return (
                <Transaction
                  key={i}
                  transaction={transaction!}
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