import PopoverLink from "@/components/common/popover-link";
import { truncateAddress, truncateTransaction } from "@/lib/utilities";
import Link from "next/link";


export default function TransactionsMobile(props: {
  network: string,
  transactions: any[] | undefined,
  txsError: any,
}) {
  if (props.transactions) return props.transactions.map(
    (transaction, i) => (
      <div
        key={i}
        className='mb-2 w-full py-2 border-b border-(--border-color) last-of-type:border-none'
      >
        <div className='pb-1 flex max-sm:w-[92vw]'>
          <p className='text-nowrap font-medium'>
            Transaction Hash:&nbsp;
          </p>
          <p className='overflow-hidden whitespace-nowrap text-ellipsis'>
            <PopoverLink
              href={`/${props.network}/transaction?hash=${transaction.hash}`}
              content={truncateTransaction(transaction.hash, 25)!}
              popover={transaction.hash}
              className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
            />
          </p>
        </div>
        <div className='pb-1'>
          <span className='font-medium'>
            Block:&nbsp;
          </span>
          <span>
            <Link
              href={`/${props.network}/block?number=${transaction.block}`}
              className='text-(--link-color) hover:text-(--hover-fg-color)'
            >
              {transaction.block}
            </Link>
          </span>
        </div>
        <div className='pb-1'>
          <span className='font-medium'>
            Age:&nbsp;
          </span>
          <span>
            {transaction.age}
          </span>
        </div>
        <div className='pb-1'>
          <span className='font-medium'>
            From:&nbsp;
          </span>
          <span>
            <PopoverLink
              href={`/${props.network}/address?hash=${transaction.from}`}
              content={truncateAddress(transaction.from, 28)}
              popover={transaction.from}
              className='left-[-12%] top-[-2.6rem] w-78 py-1.5 px-2.5'
            />
          </span>
        </div>
        <div className='pb-1'>
          <span className='pl-5 font-medium'>
            To:&nbsp;
          </span>
          <span>
          { transaction.to ?
              <PopoverLink
                href={`/${props.network}/address?hash=${transaction.to}`}
                content={truncateAddress(transaction.to, 28)}
                popover={transaction.to}
                className='left-[-12%] top-[-2.6rem] w-78 py-1.5 px-2.5'
              />
              :
              <span>/</span>
          }
          </span>
        </div>
        <div className='pb-1'>
          <span className='font-medium'>
            Amount:&nbsp;
          </span>
          <span>
            {transaction.amount}
          </span>
        </div>
      </div>
    )
  );
}