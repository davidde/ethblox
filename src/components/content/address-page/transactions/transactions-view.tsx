import PopoverLink from '@/components/common/popover-link';
import { truncateAddress, truncateTransaction } from '@/lib/utilities';
import Link from 'next/link';
import TxRow from './tx-row';


export default function TransactionsView(props: {
  network: string,
  transactions?: any[],
}) {
  if (!props.transactions) return null;

  const COLUMNS = [{
    name: 'Transaction Hash',
    render: (tx: any) => (
      <PopoverLink
        href={`/${props.network}/transaction?hash=${tx.hash}`}
        content={truncateTransaction(tx.hash, 18)}
        popover={tx.hash}
        className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
      />
  )}, {
    name: 'Block',
    render: (tx: any) => (
      <Link
        href={`/${props.network}/block?number=${tx.block}`}
        className='text-(--link-color) hover:text-(--hover-fg-color)'
      >
        {tx.block}
      </Link>
  )}, {
    name: 'Age',
    render: (tx: any) => <span>{tx.age}</span>,
  }, {
    name: 'From',
    render: (tx: any) => (
      <PopoverLink
        href={`/${props.network}/address?hash=${tx.from}`}
        content={truncateAddress(tx.from, 21)!}
        popover={tx.from}
        className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
      />
  )}, {
    name: 'To',
    render: (tx: any) =>
      tx.to ? <PopoverLink
                href={`/${props.network}/address?hash=${tx.to}`}
                content={truncateAddress(tx.to, 21)}
                popover={tx.to}
                className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
              />
              : <span>/</span>,
  }, {
    name: 'Amount',
    render: (tx: any) => <span>{tx.amount}</span>,
  }];

  return (
    <div>
      {/* Desktop display only: */}
      <div className='md:block hidden'>
        <table>
          <thead className='rounded-lg text-left font-normal'>
            <tr className='border-b border-(--border-color)'>
              { // Header Row of Table on Desktop:
                COLUMNS.map((col, i) => (
                  <th key={i} scope='col' className='px-4 py-5 font-medium'>
                    {col.name}
                  </th>
              ))}
            </tr>
          </thead>
          <tbody>{ // Content rows of table on Desktop (isMedium = true):
            props.transactions.map((tx, i) =>
              <TxRow key={i} tx={tx} cols={COLUMNS} isMedium={true} />)
          }</tbody>
        </table>
      </div>

      {/* Mobile display only: */}
      <div className='block md:hidden'>
      { // Content rows on mobile (isMedium = false):
        props.transactions.map((tx, i) =>
          <TxRow key={i} tx={tx} cols={COLUMNS} isMedium={false} />)
      }</div>
    </div>
  );
}