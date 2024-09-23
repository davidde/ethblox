import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Alchemy, Utils, TransactionResponse } from 'alchemy-sdk';
import { truncateAddress, truncateTransaction } from '@/lib/utilities';


type Props = {
  transaction: TransactionResponse
}

export default async function Transactions(props: Props) {
  const transactionHash = truncateTransaction(props.transaction.hash, 14);
  const secsSinceAdded = Math.round(Date.now() / 1000 - props.transaction.timestamp!);
  const amount = Math.round(Number(Utils.formatEther(props.transaction.value)) * 1e4) / 1e4;
  const from = truncateAddress(props.transaction.from, 21);
  const to = truncateAddress(props.transaction.to!, 21);

  console.log('transaction = ', props.transaction);
  console.log('timestamp = ', props.transaction.timestamp!);

  return (
    <div className='p-2 md:p-3 border-b border-[var(--border-color)] last:border-0 overflow-hidden'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <DocumentTextIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex md:flex-col ml-2 pt-1 md:pt-0 md:w-32'>
            <span className='px-2 md:px-4 leading-5'>{transactionHash}</span>
            <span className='md:pl-4 text-sm text-[var(--grey-fg-color)]'>({secsSinceAdded} secs ago)</span>
          </div>
        </div>
        <div className='flex flex-col ml-12 md:ml-10 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'>Amount: {`Ξ${amount}`}</span>
          <span className='pl-2 md:pl-4'>From: {from}</span>
          <span className='pl-2 md:pl-4 leading-5'>To: {to}</span>
        </div>
      </div>
    </div>
  );
}