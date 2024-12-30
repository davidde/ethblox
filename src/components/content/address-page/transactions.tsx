import { Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { truncateTransaction, truncateAddress, getSecsFromDateTimeString, getBlockAgeFromSecs } from '@/lib/utilities';
import PopoverLink from '@/components/content/home-page/blocks/popover-link';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {
  let transactions, totalTransactions, txError;
  const numberOfTransactionsToShow = 10;

  try {
    // By default returns a max of 1000 transfers:
    const txResp = await props.alchemy.core.getAssetTransfers({
      fromAddress: props.hash,
      order: SortingOrder.DESCENDING, // Latest block numbers first!
      category: [ AssetTransfersCategory.EXTERNAL ],
      // EXTERNAL: Ethereum transaction initiated by an EOA (= externally-owned account),
      // an account managed by a human, not a contract.
      withMetadata: true,
    });
    transactions = txResp.transfers;
    txError = false;
    // console.log('transactions = ', transactions);
  } catch(err) {
    console.error('getAssetTransfers()', err);
    txError = true;
  }

  try {
    const cntResp = await props.alchemy.core.getTransactionCount(props.hash);
    totalTransactions = cntResp.toLocaleString('en-US');
  } catch(err) {
    console.error('getTransactionCount()', err);
    totalTransactions = 'unknown number of';
  }

  const showTransactions = transactions && transactions.length !== 0;

  if (txError) {
    return (
      <>
        <div className={`basis-full ${showTransactions ? 'hidden' : ''}`} />
        <div className='mx-4 w-min'>
          <p className='mt-4 text-sm tracking-wider text-[var(--grey-fg-color)]'>
            TRANSACTIONS
          </p>
          <p className='text-red-500 w-[95vw]'>
            An error occurred while getting the transactions. Please reload.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* If there are no transactions, just put the next div (the TRANSACTIONS header)
      directly below the Token Holdings. This is done by introducing this invisible extra flex item
      that takes the full width of the container (flex-basis: 100%), so it will sit on its own row. */}
      <div className={`basis-full ${showTransactions ? 'hidden' : ''}`} />
      <div className='mx-4 w-min'>
        <p className={`mt-4 text-sm tracking-wider text-[var(--grey-fg-color)] ${showTransactions ? 'pb-4 border-b border-[var(--border-color)]' : ''}`}>
          TRANSACTIONS
        </p>
        {
          showTransactions ?
            <p className='pl-8 text-sm tracking-wider py-3 border-b border-[var(--border-color)]'>
              {`Showing latest ${numberOfTransactionsToShow} of ${totalTransactions} transactions`}
            </p>
            :
            <p>
              /
            </p>
        }

        {/* Mobile display only: */}
        <div className='lg:hidden portrait:block'>
          {
            transactions === undefined ? <p className='text-red-500 py-2'>Error getting transactions.</p> :
            transactions.slice(0, numberOfTransactionsToShow).map((transaction, i) => {
              const secs = getSecsFromDateTimeString(transaction.metadata.blockTimestamp);
              const blockAge = getBlockAgeFromSecs(secs);
              const amount = transaction.asset === 'ETH' ?
                  `Ξ${transaction.value?.toFixed(8)}`
                  :
                  `${transaction.value?.toFixed(8)} ${transaction.asset}`;

              return (
                <div
                  key={i}
                  className='mb-2 w-full py-2 border-b border-[var(--border-color)] last-of-type:border-none'
                >
                  <div className='pb-1 flex max-sm:w-[92vw]'>
                    <p className='text-nowrap font-medium'>
                      Transaction Hash:&nbsp;
                    </p>
                    <p className='overflow-hidden whitespace-nowrap text-ellipsis'>
                      <PopoverLink
                        href={`/${props.network}/transaction/${transaction.hash}`}
                        content={truncateTransaction(transaction.hash, 25)!}
                        popover={transaction.hash}
                        className='left-[-100%] top-[-2.6rem] w-[30rem] py-1.5 px-2.5'
                      />
                    </p>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      Block:&nbsp;
                    </span>
                    <span>
                      { Number(transaction.blockNum) }
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      Age:&nbsp;
                    </span>
                    <span>
                      {blockAge}
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      From:&nbsp;
                    </span>
                    <span>
                      <PopoverLink
                        href={`/${props.network}/address/${transaction.from}`}
                        content={truncateAddress(transaction.from, 28)!}
                        popover={transaction.from}
                        className='left-[-12%] top-[-2.6rem] w-[19.5rem] py-1.5 px-2.5'
                      />
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='pl-5 font-medium'>
                      To:&nbsp;
                    </span>
                    <span>
                      <PopoverLink
                        href={`/${props.network}/address/${transaction.to}`}
                        content={truncateAddress(transaction.to!, 28)!}
                        popover={transaction.to!}
                        className='left-[-12%] top-[-2.6rem] w-[19.5rem] py-1.5 px-2.5'
                      />
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      Amount:&nbsp;
                    </span>
                    <span>
                      {amount}
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>

        {/* Desktop display only: */}
        <table className={`hidden portrait:hidden ${showTransactions ? 'lg:table' : ''}`}>
          <thead className='rounded-lg text-left font-normal'>
            <tr className='border-b border-[var(--border-color)]'>
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
              transactions === undefined ? <p className='text-red-500 py-2'>Error getting transactions.</p> :
              transactions.slice(0, numberOfTransactionsToShow).map((transaction, i) => {
                const secs = getSecsFromDateTimeString(transaction.metadata.blockTimestamp);
                const blockAge = getBlockAgeFromSecs(secs);
                const amount = transaction.asset === 'ETH' ?
                  `Ξ${transaction.value?.toFixed(8)}`
                  :
                  `${transaction.value?.toFixed(8)} ${transaction.asset}`;

                return (
                  <tr
                    key={i}
                    className='w-full border-b border-[var(--border-color)] last-of-type:border-none py-3'
                  >
                    <td className='whitespace-nowrap py-3 pr-3'>
                      <PopoverLink
                        href={`/${props.network}/transaction/${transaction.hash}`}
                        content={truncateTransaction(transaction.hash, 18)!}
                        popover={transaction.hash}
                        className='left-[-100%] top-[-2.6rem] w-[30rem] py-1.5 px-2.5'
                      />
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      { Number(transaction.blockNum) }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      { blockAge }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      <PopoverLink
                        href={`/${props.network}/address/${transaction.from}`}
                        content={truncateAddress(transaction.from, 21)!}
                        popover={transaction.from}
                        className='left-[-35%] top-[-2.6rem] w-[19.5rem] py-1.5 px-2.5'
                      />
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      <PopoverLink
                        href={`/${props.network}/address/${transaction.to}`}
                        content={truncateAddress(transaction.to!, 21)!}
                        popover={transaction.to!}
                        className='left-[-35%] top-[-2.6rem] w-[19.5rem] py-1.5 px-2.5'
                      />
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      {amount}
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}