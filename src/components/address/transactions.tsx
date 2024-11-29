import { Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { truncateTransaction, truncateAddress, getBlockAgeFromDateTimeString } from '@/lib/utilities';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {
  let transfers;
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
    // console.log('transfers = ', transfers);
  } catch(error) {
    console.error('getAssetTransfers() Error: ', error);
  }

  const showTransfers = transfers && transfers.length !== 0;

  return (
    <>
      {/* If there are no transactions, just put the next div (which only says 'No transactions yet')
      directly below the Token Holdings. This is done by introducing this invisible extra flex item
      that takes the full width of the container (flex-basis: 100%), so it will sit on its own row. */}
      <div className={`basis-full ${showTransfers ? 'hidden' : ''}`} />
      <div className='mx-4 w-min'>
        <div className='mt-4 text-sm tracking-wider text-[var(--grey-fg-color)]'>
          {
            showTransfers ?
              <p className='pb-4 border-b border-[var(--border-color)]'>
                {`LATEST ${numberOfTransactionsToShow} TRANSACTIONS`}
              </p>
              :
              <p className='w-60'>
                NO TRANSACTIONS YET.
              </p>
          }
        </div>

        {/* Mobile display only: */}
        <div className='md:hidden'>
          {
            transfers?.slice(0, numberOfTransactionsToShow).map((transfer, i) => {
              const blockAge = getBlockAgeFromDateTimeString(transfer.metadata.blockTimestamp);

              return transfer.asset === 'ETH' ?
                <div
                  key={i}
                  className='mb-2 w-full py-2 border-b border-[var(--border-color)] last-of-type:border-none'
                >
                  <div className='pb-1 text-nowrap'>
                    <span className='font-medium'>
                      Transaction Hash:&nbsp;
                    </span>
                    <span>
                      { truncateTransaction(transfer.hash, 18) }
                    </span>
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
                      { truncateAddress(transfer.from, 21) }
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      To:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    <span className=''>
                      { truncateAddress(transfer.to!, 21) }
                    </span>
                  </div>
                  <div className='pb-1'>
                    <span className='font-medium'>
                      Amount:&nbsp;
                    </span>
                    <span>
                      Ξ{transfer.value}
                    </span>
                  </div>
                </div>
                :
                ''
              })
          }
        </div>

        {/* Desktop display only: */}
        <table className={`hidden ${showTransfers ? 'md:table' : ''}`}>
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
              transfers?.slice(0, numberOfTransactionsToShow).map((transfer, i) => {
                const blockAge = getBlockAgeFromDateTimeString(transfer.metadata.blockTimestamp);

                return transfer.asset === 'ETH' ?
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
                      Ξ{transfer.value}
                    </td>
                  </tr>
                  :
                  ''
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}