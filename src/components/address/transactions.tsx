import { Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { truncateTransaction, truncateAddress, getBlockAgeFromDateTimeString } from '@/lib/utilities';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {
  let transfers, totalTransfers, error;
  const numberOfTransactionsToShow = 10;

  try {
    const response = await props.alchemy.core.getAssetTransfers({
      fromAddress: props.hash,
      order: SortingOrder.DESCENDING, // Latest block numbers first!
      category: [ AssetTransfersCategory.EXTERNAL ],
      // EXTERNAL: Ethereum transaction initiated by an EOA (= externally-owned account),
      // an account managed by a human, not a contract.
      withMetadata: true,
    });
    transfers = response.transfers;
    totalTransfers = transfers.length;
    error = false;
    // console.log('transfers = ', transfers);
  } catch(err) {
    console.error('getAssetTransfers()', err);
    error = true;
  }

  const showTransfers = transfers && transfers.length !== 0;

  if (error) {
    return (
      <>
        <div className={`basis-full ${showTransfers ? 'hidden' : ''}`} />
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
      <div className={`basis-full ${showTransfers ? 'hidden' : ''}`} />
      <div className='mx-4 w-min'>
        <p className={`mt-4 text-sm tracking-wider text-[var(--grey-fg-color)] ${showTransfers ? 'pb-4 border-b border-[var(--border-color)]' : ''}`}>
          TRANSACTIONS
        </p>
        {
          showTransfers ?
            <p className='pl-8 text-sm tracking-wider py-3 border-b border-[var(--border-color)]'>
              {`Showing latest ${numberOfTransactionsToShow} of ${totalTransfers} transactions`}
            </p>
            :
            <p>
              /
            </p>
        }

        {/* Mobile display only: */}
        <div className='lg:hidden portrait:block'>
          {
            transfers === undefined ? <p className='text-red-500 py-2'>Error getting transactions.</p> :
            transfers.slice(0, numberOfTransactionsToShow).map((transfer, i) => {
              const blockAge = getBlockAgeFromDateTimeString(transfer.metadata.blockTimestamp);

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
                      { truncateTransaction(transfer.hash, 25) }
                    </p>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      Block:&nbsp;
                    </span>
                    <span>
                      { Number(transfer.blockNum) }
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
                    <span className=''>
                      { truncateAddress(transfer.from, 28) }
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      To:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className=''>
                      { truncateAddress(transfer.to!, 28) }
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      Amount:&nbsp;
                    </span>
                    <span>
                      {transfer.value?.toFixed(8)} {transfer.asset}
                    </span>
                  </div>
                </div>
              );
            })
          }
        </div>

        {/* Desktop display only: */}
        <table className={`hidden portrait:hidden ${showTransfers ? 'lg:table' : ''}`}>
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
              transfers === undefined ? <p className='text-red-500 py-2'>Error getting transactions.</p> :
              transfers.slice(0, numberOfTransactionsToShow).map((transfer, i) => {
                const blockAge = getBlockAgeFromDateTimeString(transfer.metadata.blockTimestamp);

                return (
                  <tr
                    key={i}
                    className='w-full border-b border-[var(--border-color)] last-of-type:border-none py-3'
                  >
                    <td className='whitespace-nowrap py-3 pr-3'>
                      { truncateTransaction(transfer.hash, 18) }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      { Number(transfer.blockNum) }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      { blockAge }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      { truncateAddress(transfer.from, 21) }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      { truncateAddress(transfer.to!, 21) }
                    </td>
                    <td className='whitespace-nowrap px-4 py-3'>
                      {transfer.value?.toFixed(8)} {transfer.asset}
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