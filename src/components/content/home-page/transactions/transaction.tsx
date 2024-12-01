import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { Utils, TransactionResponse } from 'alchemy-sdk';
import { truncateAddress, truncateTransaction } from '@/lib/utilities';
import LinkWithPopover from '@/components/content/home-page/blocks/link-with-popover';


type Props = {
  transaction: TransactionResponse,
  network: string
}

export default async function Transactions(props: Props) {
  const transactionHash = truncateTransaction(props.transaction.hash, 18);
  const amount = Math.round(Number(Utils.formatEther(props.transaction.value)) * 1e6) / 1e6;
  const from = props.transaction.from;
  const fromShort = truncateAddress(from, 21);
  const to = props.transaction.to!;
  const toShort = truncateAddress(to, 21);

  return (
    <div className='p-2 md:p-3 border-b border-[var(--border-color)] last:border-0 overflow-hidden'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <DocumentTextIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex flex-col ml-2 pt-1 md:pt-0 md:w-48'>
            <span className='px-2 md:px-4'>{transactionHash}</span>
            <span className='px-2 md:pl-4'>Amount: {`Ξ${amount}`}</span>
          </div>
        </div>
        <div className='flex flex-col ml-12 md:ml-4 my-2 md:my-0'>
          <span className='pl-2 md:pl-4'>
            From:&nbsp;
            <LinkWithPopover
              href={`/${props.network}/address/${from}`}
              content={fromShort!}
              popover={from}
            />
          </span>
          <span className='pl-7 md:pl-9'>
            To:&nbsp;
            <LinkWithPopover
              href={`/${props.network}/address/${to}`}
              content={toShort!}
              popover={to}
            />
          </span>
        </div>
      </div>
    </div>
  );
}