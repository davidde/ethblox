'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TransactionResponse } from 'alchemy-sdk';
import { truncateAddress, truncateTransaction, getEtherValueFromWei } from '@/lib/utilities';
import PopoverLink from '@/components/common/popover-link';


export default function Transaction(props: {
  transaction: TransactionResponse,
  network: string
}) {
  const transactionHash = props.transaction.hash;
  const transactionHashShort = truncateTransaction(props.transaction.hash, 18);
  const amount = getEtherValueFromWei(props.transaction.value, 6);
  const from = props.transaction.from;
  const fromShort = truncateAddress(from, 21);
  let to, toShort;
  if (props.transaction.to) {
    to = props.transaction.to;
    toShort = truncateAddress(to, 21);
  }

  return (
    <div className='p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <DocumentTextIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex flex-col ml-2 pt-1 md:pt-0 md:w-48'>
            <span className='px-2 md:px-4'>
              <PopoverLink
                href={`/${props.network}/transaction?hash=${transactionHash}`}
                content={transactionHashShort}
                popover={transactionHash}
                className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
              />
            </span>
            <span className='px-2 md:pl-4'>Amount: {`Ξ${amount}`}</span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-4 my-2 md:my-0'>
          <span className='pl-2 md:pl-4'>
            From:&nbsp;
            <PopoverLink
              href={`/${props.network}/address?hash=${from}`}
              content={fromShort}
              popover={from}
              className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
            />
          </span>
          <span className='pl-7 md:pl-9'>
            To:&nbsp;
            { to ?
                  <PopoverLink
                    href={`/${props.network}/address?hash=${to}`}
                    content={toShort!}
                    popover={to}
                    className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                  />
                  : <span>/</span>
            }
          </span>
        </div>
      </div>
    </div>
  );
}