'use client';

import { Alchemy, Utils, TransactionResponse, TransactionReceipt } from 'alchemy-sdk';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';


type Props = {
  network: string,
  alchemy: Alchemy
}

export default function TransactionPage(props: Props) {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash')!;

  const [tx, setTx] = useState<TransactionResponse | null>(null);
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null);

  useEffect(() => {
    async function getTransactionData() {
      try {
        const txData = await props.alchemy.transact.getTransaction(hash);
        setTx(txData);
      } catch (err) {
        console.error('getTransaction()', err);
      }

      try {
        const txReceiptData = await props.alchemy.core.getTransactionReceipt(hash);
        setTxReceipt(txReceiptData);
      } catch (err) {
        console.error('getTransactionReceipt()', err);
      }
    }

    getTransactionData();
  }, [hash, props.alchemy]);

  return (
    <main className='m-4 mt-8 md:m-8'>
      <h1 className='text-lg font-bold'>
        Transaction Details
      </h1>
      <ul className='max-w-[90vw] break-words mt-8'>
        <li className='list-disc ml-4 m-2'>
          <p className='flex flex-col md:flex-row'>
            <span className='w-60'>Transaction Hash:</span>
            <span>{hash}</span>
          </p>
        </li>
        <div className='ml-4'>
          <p className='md:flex'>
            <span className='w-60 md:pl-[5.25rem]'>Status:</span>
            {
              txReceipt ?
                txReceipt.status ?
                  <span className='bg-green-200 text-green-700 border-green-400
                              dark:bg-green-400 dark:text-green-800 dark:border-green-800
                              border rounded-md p-1 px-4 w-[6.4rem] ml-4 md:ml-0'>
                    Success
                  </span> :
                  <span className='bg-red-200 text-red-700 border-red-400
                              dark:bg-red-500 dark:text-red-100 dark:border-red-300
                              border rounded-md p-1 px-4 w-[5rem] ml-4 md:ml-0'>
                    Fail
                  </span>
                :
                <span className='text-red-500 ml-4 md:ml-0'>Error getting data.</span>
            }
          </p>
        </div>
        <li className='list-disc ml-4 mt-4 m-2'>
          <p className='md:flex'>
            <span className='w-60'>Block:</span>
            <span>
              {
              tx ?
                <Link
                  href={`/${props.network}/block?number=${tx.blockNumber}`}
                  className='ml-2 md:ml-0 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
                >
                  {tx.blockNumber}
                </Link>
                :
                <span className='text-red-500 ml-2 md:ml-0'>Error getting data.</span>
              }
            </span>
          </p>
        </li>
        <div className='ml-4'>
          <p className='md:flex'>
            <span className='w-60 md:pl-[1.55rem]'>Confirmations:</span>
            <span className='ml-2 md:ml-0'>
              {
                tx ? tx.confirmations : <span className='text-red-500'>Error getting data.</span>
              }
            </span>
          </p>
        </div>
        <li className='list-disc ml-4 mt-4 m-2'>
          <p className='md:flex'>
            <span className='w-60'>Value:</span>
            <span className='ml-2 md:ml-0'>
              {
                tx ? `Ξ${Utils.formatEther(tx.value)}` : <span className='text-red-500'>Error getting data.</span>
              }
            </span>
          </p>
        </li>
        <div className='ml-4'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[5.8rem]'>From:</span>
            {
              tx ?
                <Link
                  href={`/${props.network}/address?hash=${tx.from}`}
                  className='font-mono ml-2 md:ml-0 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
                >
                  {tx.from}
                </Link>
                :
                <span className='text-red-500 ml-2 md:ml-0'>Error getting data.</span>
            }
          </p>
        </div>
        <div className='ml-4 pt-2 md:pt-0'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[7.05rem]'>To:</span>
            {
              tx ?
                <Link
                  href={`/${props.network}/address?hash=${tx.to}`}
                  className='font-mono ml-2 md:ml-0 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
                >
                  {tx.to}
                </Link>
                :
                <span className='text-red-500 ml-2 md:ml-0'>Error getting data.</span>
            }
          </p>
        </div>
        <li className='list-disc ml-4 mt-4 m-2'>
          <p className='md:flex'>
            <span className='w-60 text-nowrap'>Transaction Fee:</span>
            <span className='ml-2 md:ml-0'>
              {
                tx && txReceipt ?
                  `Ξ${Utils.formatEther(tx.gasPrice!.mul(txReceipt.gasUsed))} (= Gas Price * Gas Used)`
                  :
                  <span className='text-red-500'>Error getting data.</span>
              }
            </span>
          </p>
        </li>
        <div className='ml-4 pt-2 md:pt-0'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[3.7rem]'>Gas Price:</span>
            <span className='ml-2 md:ml-0'>
              {
                tx ?
                  `${+Utils.formatEther(tx.gasPrice!) * Math.pow(10, 9)} Gwei (Ξ${Utils.formatEther(tx.gasPrice!)})`
                  :
                  <span className='text-red-500'>Error getting data.</span>
              }
              </span>
          </p>
        </div>
        <div className='ml-4 pt-2 md:pt-0'>
          <p className='md:flex'>
            <span className='w-60 pl-2 md:pl-[3.65rem]'>Gas Used:</span>
            <span className='ml-2 md:ml-0'>
              {
                txReceipt ?
                  `${+Utils.formatEther(txReceipt.gasUsed) * Math.pow(10, 9)} Gwei (Ξ${Utils.formatEther(txReceipt.gasUsed)})`
                  :
                  <span className='text-red-500'>Error getting data.</span>
              }
              </span>
          </p>
        </div>
      </ul>
    </main>
  );
}
