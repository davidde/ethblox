import { Alchemy, Utils } from 'alchemy-sdk';
import Link from 'next/link';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function TransactionPage(props: Props) {
  let tx, txReceipt;

  while (!tx) {
    try {
      tx = await props.alchemy.transact.getTransaction(props.hash);
    } catch (err) {
      console.error('getTransaction()', err);
    }
  }
  while (!txReceipt) {
    try {
      txReceipt = await props.alchemy.core.getTransactionReceipt(props.hash);
    } catch (err) {
      console.error('getTransactionReceipt()', err);
    }
  }

  return (
    <main className='m-4 mt-8 md:m-8'>
      <h1 className='text-lg font-bold'>
        Transaction Details
      </h1>
      <ul className='max-w-[90vw] break-words mt-8'>
        <li className='list-disc ml-4 m-2'>
          <p className='flex flex-col md:flex-row'>
            <span className='w-60'>Transaction Hash:</span>
            <span>{props.hash}</span>
          </p>
        </li>
        <div className='ml-4'>
          <p className='md:flex'>
            <span className='w-60 md:pl-[5.25rem]'>Status:</span>
            {
              txReceipt.status ?
                <span className='bg-green-100 text-green-700 border-green-400 border rounded-md p-1 px-4 w-[6.4rem] ml-4 md:ml-0'>
                  Success
                </span> :
                <span className='bg-red-100 text-red-700 border-red-400 border rounded-md p-1 px-4 w-[5rem] ml-4 md:ml-0'>
                  Fail
                </span>
            }
          </p>
        </div>
        <li className='list-disc ml-4 mt-4 m-2'>
          <p className='md:flex'>
            <span className='w-60'>Block:</span>
            <span>
              <Link
                href={`/${props.network}/block/${tx.blockNumber}`}
                className='ml-2 md:ml-0 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
              >
                {tx.blockNumber}
              </Link>
            </span>
          </p>
        </li>
        <div className='ml-4'>
          <p className='md:flex'>
            <span className='w-60 md:pl-[1.55rem]'>Confirmations:</span>
            <span className='ml-2 md:ml-0'>{tx.confirmations}</span>
          </p>
        </div>
        <li className='list-disc ml-4 mt-4 m-2'>
          <p className='md:flex'>
            <span className='w-60'>Value:</span>
            <span className='ml-2 md:ml-0'>Ξ{Utils.formatEther(tx.value)}</span>
          </p>
        </li>
        <div className='ml-4'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[5.8rem]'>From:</span>
            <Link
              href={`/${props.network}/address/${tx.from}`}
              className='font-mono ml-2 md:ml-0 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
            >
              {tx.from}
            </Link>
          </p>
        </div>
        <div className='ml-4 pt-2 md:pt-0'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[7.05rem]'>To:</span>
            <Link
              href={`/${props.network}/address/${tx.to}`}
              className='font-mono ml-2 md:ml-0 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
            >
              {tx.to}
            </Link>
          </p>
        </div>
        <li className='list-disc ml-4 mt-4 m-2'>
          <p className='md:flex'>
            <span className='w-60 text-nowrap'>Transaction Fee:</span>
            <span className='ml-2 md:ml-0'>Ξ{Utils.formatEther(tx.gasPrice!.mul(txReceipt.gasUsed))} (= Gas Price * Gas Used)</span>
          </p>
        </li>
        <div className='ml-4 pt-2 md:pt-0'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[3.7rem]'>Gas Price:</span>
            <span className='ml-2 md:ml-0'>{+Utils.formatEther(tx.gasPrice!) * Math.pow(10, 9)} Gwei (Ξ{Utils.formatEther(tx.gasPrice!)})</span>
          </p>
        </div>
        <div className='ml-4 pt-2 md:pt-0'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[3.65rem]'>Gas Used:</span>
            <span className='ml-2 md:ml-0'>{+Utils.formatEther(txReceipt.gasUsed) * Math.pow(10, 9)} Gwei (Ξ{Utils.formatEther(txReceipt.gasUsed)})</span>
          </p>
        </div>
      </ul>
    </main>
  );
}
