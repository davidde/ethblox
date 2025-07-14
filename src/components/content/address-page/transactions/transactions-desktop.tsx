import PopoverLink from "@/components/common/popover-link";
import { truncateAddress, truncateTransaction } from "@/lib/utilities";
import Link from "next/link";


export default function TransactionsDesktop(props: {
  network: string,
  transactions?: any[],
}) {
  if (!props.transactions) return null;
  return (
    <table>
      <thead className='rounded-lg text-left font-normal'>
        <tr className='border-b border-(--border-color)'>
          { // Header Row of Table:
            ['Transaction Hash', 'Block', 'Age', 'From', 'To', 'Amount'].map((value, i) => (
              <th key={i} scope='col' className='px-4 py-5 font-medium'>
                {value}
              </th>
          ))}
        </tr>
      </thead>
      <tbody>
        { // Content rows of table:
          props.transactions.map((tx, i) => (
            <tr
              key={i}
              className='w-full border-b border-(--border-color) last-of-type:border-none py-3'
            >
              <td className='whitespace-nowrap px-4 py-3'>
                <PopoverLink
                  href={`/${props.network}/transaction?hash=${tx.hash}`}
                  content={truncateTransaction(tx.hash, 18)!}
                  popover={tx.hash}
                  className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
                />
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                <Link
                  href={`/${props.network}/block?number=${tx.block}`}
                  className='text-(--link-color) hover:text-(--hover-fg-color)'
                >
                  {tx.block}
                </Link>
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                {tx.age}
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                <PopoverLink
                  href={`/${props.network}/address?hash=${tx.from}`}
                  content={truncateAddress(tx.from, 21)!}
                  popover={tx.from}
                  className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                {
                  tx.to ?
                    <PopoverLink
                      href={`/${props.network}/address?hash=${tx.to}`}
                      content={truncateAddress(tx.to, 21)}
                      popover={tx.to}
                      className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                    />
                    :
                    <span>/</span>
                }
              </td>
              <td className='whitespace-nowrap px-4 py-3'>{tx.amount}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}