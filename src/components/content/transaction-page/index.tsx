'use client';

import { useState, useEffect } from 'react';
import { getAlchemy } from '@/lib/utilities';
import { Utils, TransactionResponse, TransactionReceipt } from 'alchemy-sdk';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GreenSpan from '@/components/common/green-span';
import RedSpan from '@/components/common/red-span';


export default function TransactionPage(props: {network: string}) {
  const alchemy = getAlchemy(props.network);
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash')!;

  const [tx, setTx] = useState<TransactionResponse | null>(null);
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt | null>(null);

  useEffect(() => {
    async function getTransactionData() {
      try {
        const txData = await alchemy.transact.getTransaction(hash);
        setTx(txData);
      } catch (err) {
        console.error('getTransaction()', err);
      }

      try {
        const txReceiptData = await alchemy.core.getTransactionReceipt(hash);
        setTxReceipt(txReceiptData);
      } catch (err) {
        console.error('getTransactionReceipt()', err);
      }
    }

    getTransactionData();
  }, [alchemy, hash]);

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
            <span className='w-60 md:pl-21'>Status:</span>
            {
              txReceipt ?
                txReceipt.status ?
                  <GreenSpan className='border rounded-md p-1 px-4 w-[6.4rem] h-[2.2rem] ml-4 md:ml-0'>
                    Success
                  </GreenSpan>
                  :
                  <RedSpan className='border rounded-md p-1 px-4 w-[5rem] h-[2.2rem] ml-4 md:ml-0'>
                    Fail
                  </RedSpan>
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
                  className='ml-2 md:ml-0 text-(--link-color) hover:text-(--hover-fg-color)'
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
                  className='font-mono ml-2 md:ml-0 text-(--link-color) hover:text-(--hover-fg-color)'
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
                  className='font-mono ml-2 md:ml-0 text-(--link-color) hover:text-(--hover-fg-color)'
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
