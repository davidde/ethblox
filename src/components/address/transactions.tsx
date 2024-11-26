import { Alchemy, AssetTransfersCategory, SortingOrder } from 'alchemy-sdk';
import { truncateTransaction, truncateAddress } from '@/lib/utilities';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {
  const response = await props.alchemy.core.getAssetTransfers({
    fromAddress: props.hash,
    order: SortingOrder.DESCENDING, // Latest block numbers first!
    category: [ AssetTransfersCategory.EXTERNAL ],
    // EXTERNAL: Ethereum transaction initiated by an EOA (= externally-owned account),
    // an account managed by a human, not a contract.
  });
  const transfers = response.transfers;

  const numberOfTransactionsToShow = 10;

  return (
    <div>
      <p className='px-4 pt-4 text-sm tracking-wider text-[var(--grey-fg-color)]'>
        {
          transfers.length !== 0 ?
            `LATEST ${numberOfTransactionsToShow} TRANSACTIONS`
            :
            'No transactions yet.'
        }
      </p>
      {/* Mobile display only: */}
      <div className='md:hidden'>
        {
          transfers?.slice(0, numberOfTransactionsToShow).map((transfer, i) => (
            transfer.asset === 'ETH' ?
              <div
                key={i}
                className='mb-2 w-full rounded-md bg-white pl-4 py-2 border-b last-of-type:border-none'
              >
                <div className='pb-1'>
                  <p className='font-medium'>
                    Transaction Hash
                  </p>
                  <p className=''>
                    { truncateTransaction(transfer.hash, 18) }
                  </p>
                </div>
                <div className='flex w-full items-center justify-start pb-1'>
                  <div className='pr-6'>
                    <p className='font-medium'>
                      Block
                    </p>
                    <p>
                    { Number(transfer.blockNum) }
                    </p>
                  </div>
                  <div>
                    <p className='font-medium'>
                      Amount
                    </p>
                    <p>
                      Ξ{transfer.value}
                    </p>
                  </div>
                </div>
                <div className='pb-1'>
                  <p className='font-medium'>
                    From
                  </p>
                  <p className=''>
                    { truncateAddress(transfer.from, 21) }
                  </p>
                </div>
                <div className='pb-1'>
                  <p className='font-medium'>
                    To
                  </p>
                  <p className=''>
                    { truncateAddress(transfer.to!, 21) }
                  </p>
                </div>
              </div>
              :
              ''
            ))
        }
      </div>

      {/* Desktop display only: */}
      <table className='hidden md:table text-gray-900 ml-8'>
        <thead className='rounded-lg text-left font-normal'>
          <tr className='border-b'>
            <th scope='col' className='py-5 font-medium'>
              Transaction Hash
            </th>
            <th scope='col' className='px-4 py-5 font-medium'>
              Block
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
        <tbody className='bg-white'>
          {
            transfers?.slice(0, numberOfTransactionsToShow).map((transfer, i) => (
              transfer.asset === 'ETH' ?
                <tr
                  key={i}
                  className='w-full border-b last-of-type:border-none py-3'
                >
                  <td className='whitespace-nowrap py-3 pr-3'>
                    { truncateTransaction(transfer.hash, 18) }
                  </td>
                  <td className='whitespace-nowrap px-4 py-3'>
                    { Number(transfer.blockNum) }
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
          ))}
        </tbody>
      </table>
    </div>
  );
}