'use client';

import { useState, useEffect } from 'react';
import {
  AssetTransfersCategory,
  SortingOrder,
  AssetTransfersWithMetadataResult
} from 'alchemy-sdk';
import {
  truncateTransaction,
  truncateAddress,
  getSecsFromDateTimeString,
  getBlockAgeFromSecs,
  getAlchemy
}
from '@/lib/utilities';
import PopoverLink from '@/components/common/popover-link';
import Link from 'next/link';
import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';
import ValueDisplay from '@/components/common/value-display';


export default function Transactions(props: {
  hash: string,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const maxNumberOfTransactionsToShow = 10;
  const [transactionsResult, setTransactionsResult] = useState<AssetTransfersWithMetadataResult[]>();
  const [totalTransactions, setTotalTransactions] = useState<string>();
  const [transactionsError, setTransactionsError] = useState<string>();

  useEffect(() => {
    (async () => {
      try {
        // By default returns a max of 1000 transfers:
        const resp = await alchemy.core.getAssetTransfers({
          fromAddress: props.hash,
          order: SortingOrder.DESCENDING, // Latest block numbers first!
          // EXTERNAL: Ethereum transaction initiated by an EOA (= externally-owned account),
          // an account managed by a human, not a contract:
          category: [ AssetTransfersCategory.EXTERNAL ],
          withMetadata: true,
        });
        setTransactionsResult(resp.transfers);
      } catch(err) {
        const error = 'AddressPage Transactions getAssetTransfers()' + err;
        console.error(error);
        setTransactionsError(error);
      }

      try {
        const resp = await alchemy.core.getTransactionCount(props.hash);
        setTotalTransactions(resp.toLocaleString('en-US'));
      } catch(err) {
        setTotalTransactions('unknown number of');
        const error = 'AddressPage Transactions getTransactionCount()' + err;
        console.error(error);
      }
    })();
  }, [alchemy, props.hash]);

  let transactionsDigest, transactionsPresent, transactions;
  if (transactionsResult) {
    transactionsPresent = transactionsResult.length !== 0;
    if (transactionsPresent) {
      const numberOfTransactionsToShow = transactionsResult.length < maxNumberOfTransactionsToShow ?
        transactionsResult.length : maxNumberOfTransactionsToShow;

      transactionsDigest = <p className='pl-8 mt-4 text-sm tracking-wider
                                        py-3 border-y border-(--border-color)'>{
        numberOfTransactionsToShow > 1 ?
          `Showing latest ${numberOfTransactionsToShow} external transactions of ${totalTransactions} transactions total`
          :
          `Showing last external transaction of ${totalTransactions} transactions total`
      }</p>;

      transactions = transactionsResult.slice(0, maxNumberOfTransactionsToShow).map(
        tx => ({
            hash: tx.hash,
            block: +tx.blockNum,
            age: getBlockAgeFromSecs(getSecsFromDateTimeString(tx.metadata.blockTimestamp)),
            from: tx.from,
            to: tx.to,
            amount: tx.asset === 'ETH' ? `Ξ${tx.value?.toFixed(8) || ''}`
                  : `${tx.value?.toFixed(8) || ''} ${tx.asset || '/'}`,
        })
      );
    } else transactionsDigest = <p>/</p>;
  }

  return (
    <>
      {/* If there are no transactions, just put the next div (the TRANSACTIONS header)
      directly below the Token Holdings. This is done by introducing this invisible
      extra flex item that takes the full width of the container (flex-basis: 100%),
      so it will sit on its own row. */}
      <div className={`basis-full ${transactionsPresent ? 'hidden' : ''}`} />
      <div className='w-min'>
        <p className='mt-4 capsTitle'>
          TRANSACTIONS
        </p>
        <ValueDisplay
          value={transactionsDigest}
          error={transactionsError} // ErrorIndicator className='py-2 w-[95vw]'
          err='Error getting transactions. Please reload.'
        />

        {/* Mobile display only: */}
        <div className='lg:hidden portrait:block'>
          {
            transactions ?
              transactions.map((transaction, i) => (
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
              ))
              :
              (transactionsError ?
                  <ErrorIndicator
                    error='Error getting transactions.'
                    className='py-2'
                  />
                  :
                  '')
          }
        </div>

        {/* Desktop display only: */}
        {
          transactions ?
            <table className={`hidden ${transactionsPresent ? 'lg:table' : ''}`}>
              <thead className='rounded-lg text-left font-normal'>
                <tr className='border-b border-(--border-color)'>
                  <th scope='col' className='py-5 font-medium'>
                    Transaction Hash
                  </th>
                  <th scope='col' className='px-4 py-5 font-medium'>
                    Block
                  </th>
                  <th scope='col' className='px-4 py-5 font-medium'>
                    Age
                  </th>
                  <th scope='col' className='px-4 py-5 font-medium'>
                    From
                  </th>
                  <th scope='col' className='px-4 py-5 font-medium'>
                    To
                  </th>
                  <th scope='col' className='px-4 py-5 font-medium'>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  transactions.map((transaction, i) => (
                    <tr
                      key={i}
                      className='w-full border-b border-(--border-color) last-of-type:border-none py-3'
                    >
                      <td className='whitespace-nowrap py-3 pr-3'>
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
                        <PopoverLink
                          href={`/${props.network}/address?hash=${transaction.to}`}
                          content={truncateAddress(transaction.to!, 21)!}
                          popover={transaction.to!}
                          className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                        />
                      </td>
                      <td className='whitespace-nowrap px-4 py-3'>
                        {transaction.amount}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            :
            (transactionsError ?
              <ErrorIndicator
                error='Error getting transactions.'
                className={`py-2 hidden portrait:hidden ${transactionsPresent ? 'lg:inline' : ''}`}
              />
              :
              '')
        }
      </div>
    </>
  );
}