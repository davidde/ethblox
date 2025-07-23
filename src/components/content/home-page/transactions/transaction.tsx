'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { BlockWithTransactions } from 'alchemy-sdk';
import { truncateAddress, truncateTransaction, getEtherValueFromWei } from '@/lib/utilities';
import PopoverLink from '@/components/common/popover-link';
import DataState from '@/lib/data-state';


export default function Transaction(props: {
  id: number,
  blockWithTransactions: DataState<BlockWithTransactions>,
  network: string
}) {
  // Use a callback because the transactions might still be loading:
  const transaction = () => props.blockWithTransactions.value!.transactions[props.id];

  return (
    <div className='md:min-h-[4.825rem] p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <DocumentTextIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex flex-col ml-2 pt-1 md:pt-0 md:w-48'>
            <span className='px-2 md:px-4'>
              <props.blockWithTransactions.Render
                value={() =>
                  <PopoverLink
                    href={`/${props.network}/transaction?hash=${transaction().hash}`}
                    content={truncateTransaction(transaction().hash, 18)}
                    popover={transaction().hash}
                    className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
                  />}
                error='Error'
                />
            </span>
            <span className='px-2 md:pl-4'>
              Amount: &nbsp;
              <props.blockWithTransactions.Render
                value={() => `Ξ${getEtherValueFromWei(transaction().value, 6)}`}
                error='Error'
              />
            </span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-4 my-2 md:my-0'>
          <span className='pl-2 md:pl-4'>
            From: &nbsp;
            <props.blockWithTransactions.Render
              value={() =>
                <PopoverLink
                  href={`/${props.network}/address?hash=${transaction().from}`}
                  content={truncateAddress(transaction().from, 21)}
                  popover={transaction().from}
                  className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />}
              error='Error'
            />
          </span>
          <span className='pl-7 md:pl-9'>
            To: &nbsp;
            <props.blockWithTransactions.Render
              value={() => transaction().to ?
                  <PopoverLink
                    href={`/${props.network}/address?hash=${transaction().to}`}
                    content={truncateAddress(transaction().to!, 21)}
                    popover={transaction().to!}
                    className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                  />
                  : <span>/</span>}
              error='Error'
            />
          </span>
        </div>
      </div>
    </div>
  );
}