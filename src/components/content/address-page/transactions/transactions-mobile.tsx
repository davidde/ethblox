import PopoverLink from "@/components/common/popover-link";
import { truncateAddress, truncateTransaction } from "@/lib/utilities";
import Link from "next/link";


export default function TransactionsMobile(props: {
  network: string,
  transactions?: any[],
}) {
  if (!props.transactions) return null;
  return props.transactions.map(
    (tx, i) => (
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
              href={`/${props.network}/transaction?hash=${tx.hash}`}
              content={truncateTransaction(tx.hash, 25)!}
              popover={tx.hash}
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
              href={`/${props.network}/block?number=${tx.block}`}
              className='text-(--link-color) hover:text-(--hover-fg-color)'
            >
              {tx.block}
            </Link>
          </span>
        </div>
        <div className='pb-1'>
          <span className='font-medium'>
            Age:&nbsp;
          </span>
          <span>{tx.age}</span>
        </div>
        <div className='pb-1'>
          <span className='font-medium'>
            From:&nbsp;
          </span>
          <span>
            <PopoverLink
              href={`/${props.network}/address?hash=${tx.from}`}
              content={truncateAddress(tx.from, 28)}
              popover={tx.from}
              className='left-[-12%] top-[-2.6rem] w-78 py-1.5 px-2.5'
            />
          </span>
        </div>
        <div className='pb-1'>
          <span className='pl-5 font-medium'>
            To:&nbsp;
          </span>
          <span>
          { tx.to ?
              <PopoverLink
                href={`/${props.network}/address?hash=${tx.to}`}
                content={truncateAddress(tx.to, 28)}
                popover={tx.to}
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
          <span>{tx.amount}</span>
        </div>
      </div>
    )
  );
}