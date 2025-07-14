import PopoverLink from "@/components/common/popover-link";
import { truncateAddress, truncateTransaction } from "@/lib/utilities";
import Link from "next/link";


export default function TransactionsDesktop(props: {
  network: string,
  transactions: any[] | undefined,
  txsError: any,
}) {
  if (props.transactions) return (
    <table>
      <thead className='rounded-lg text-left font-normal'>
        <tr className='border-b border-(--border-color)'>
          { // Header Row of Table:
            ['Transaction Hash', 'Block', 'Age', 'From', 'To', 'Amount'].map((value, i) => (
              <th scope='col' key={i} className='px-4 py-5 font-medium'>
                {value}
              </th>
            ))
          }
        </tr>
      </thead>
      <tbody>
        { // Content rows of table:
          props.transactions.map((transaction, i) => (
            <tr
              key={i}
              className='w-full border-b border-(--border-color) last-of-type:border-none py-3'
            >
              <td className='whitespace-nowrap px-4 py-3'>
                <PopoverLink
                  href={`/${props.network}/transaction?hash=${transaction.hash}`}
                  content={truncateTransaction(transaction.hash, 18)!}
                  popover={transaction.hash}
                  className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
                />
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                <Link
                  href={`/${props.network}/block?number=${transaction.block}`}
                  className='text-(--link-color) hover:text-(--hover-fg-color)'
                >
                  {transaction.block}
                </Link>
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                {transaction.age}
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                <PopoverLink
                  href={`/${props.network}/address?hash=${transaction.from}`}
                  content={truncateAddress(transaction.from, 21)!}
                  popover={transaction.from}
                  className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                {
                  transaction.to ?
                    <PopoverLink
                      href={`/${props.network}/address?hash=${transaction.to}`}
                      content={truncateAddress(transaction.to, 21)}
                      popover={transaction.to}
                      className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                    />
                    :
                    <span>/</span>
                }
              </td>
              <td className='whitespace-nowrap px-4 py-3'>
                {transaction.amount}
              </td>
            </tr>
          ))
        }
      </tbody>
    </table>
  );
}