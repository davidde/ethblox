'use client';

import { useState, useEffect } from 'react';
import { getAlchemy } from '@/lib/utilities';
import { Utils, TransactionResponse, TransactionReceipt } from 'alchemy-sdk';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GreenSpan from '@/components/common/green-span';
import RedSpan from '@/components/common/red-span';
import ValueDisplay from '@/components/common/value-display';


export default function TransactionPage(props: {network: string}) {
  const alchemy = getAlchemy(props.network);
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash')!;

  const [tx, setTx] = useState<TransactionResponse>();
  const [txReceipt, setTxReceipt] = useState<TransactionReceipt>();

  const [txError, setTxError] = useState('');
  const [txReceiptError, setTxReceiptError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const resp = await alchemy.transact.getTransaction(hash);
        if (!resp) throw new Error('Error: Transaction is unknown.');
        setTx(resp);
      } catch (err) {
        const error = 'TransactionPage getTransaction() ' + err;
        console.error(error);
        setTxError(error);
      }

      try {
        const resp = await alchemy.core.getTransactionReceipt(hash);
        if (!resp) throw new Error('Error: Transaction has not been mined.');
        setTxReceipt(resp);
      } catch (err) {
        const error = 'TransactionPage getTransactionReceipt() ' + err;
        console.error(error);
        setTxReceiptError(error);
      }
    })();
  }, [alchemy, hash]);

  let status, txFee, gasUsed;
  if (txReceipt) {
    status = txReceipt.status ?
      <GreenSpan className='w-[6.4rem] ml-4 md:ml-0'>
        Success
      </GreenSpan>
      :
      <RedSpan className='w-[5rem] ml-4 md:ml-0'>
        Fail
      </RedSpan>;

    gasUsed = `${+Utils.formatEther(txReceipt.gasUsed) * Math.pow(10, 9)} Gwei (Ξ${Utils.formatEther(txReceipt.gasUsed)})`;

    if (tx) txFee = `Ξ${Utils.formatEther(tx.gasPrice!.mul(txReceipt.gasUsed))} (= Gas Price * Gas Used)`;
  }

  let block, confirmations, value, from, to, gasPrice;
  if (tx) {
    block = <Link href={`/${props.network}/block?number=${tx.blockNumber}`}
             className='ml-2 md:ml-0 text-(--link-color) hover:text-(--hover-fg-color)'>
              {tx.blockNumber}</Link>;
    confirmations = tx.confirmations;
    value = `Ξ${Utils.formatEther(tx.value)}`;
    from = <Link href={`/${props.network}/address?hash=${tx.from}`}
            className='font-mono ml-2 md:ml-0 text-(--link-color) hover:text-(--hover-fg-color)'>
              {tx.from}
            </Link>;
    to = <Link href={`/${props.network}/address?hash=${tx.to}`}
          className='font-mono ml-2 md:ml-0 text-(--link-color) hover:text-(--hover-fg-color)'>
            {tx.to}
          </Link>;
    gasPrice = `${+Utils.formatEther(tx.gasPrice!) * Math.pow(10, 9)} Gwei (Ξ${Utils.formatEther(tx.gasPrice!)})`;
  }

  return (
    <main>
      <div className='flex items-center justify-center w-full px-[0.5rem] md:px-8'>
        <div className='mt-8 p-4 md:p-8 w-full max-w-[calc(100vw-1rem)] md:max-w-[62rem]
         border border-(--border-color) bg-(--comp-bg-color) rounded-lg'>
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
                <ValueDisplay
                  value={status}
                  error={txReceiptError}
                  fallbackClass='h-[2.2rem]'
                />
              </p>
            </div>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='md:flex'>
                <span className='w-60'>Block:</span>
                <span>
                  <ValueDisplay
                    value={block}
                    error={txError}
                  />
                </span>
              </p>
            </li>
            <div className='ml-4'>
              <p className='md:flex'>
                <span className='w-60 md:pl-[1.55rem]'>Confirmations:</span>
                <span className='ml-2 md:ml-0'>
                  <ValueDisplay
                    value={confirmations}
                    error={txError}
                  />
                </span>
              </p>
            </div>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='md:flex'>
                <span className='w-60'>Value:</span>
                <span className='ml-2 md:ml-0'>
                  <ValueDisplay
                    value={value}
                    error={txError}
                  />
                </span>
              </p>
            </li>
            <div className='ml-4'>
              <p className='md:flex'>
                <span className='w-60 pl-2 md:pl-[5.8rem]'>From:</span>
                <ValueDisplay
                  value={from}
                  error={txError}
                />
              </p>
            </div>
            <div className='ml-4 pt-2 md:pt-0'>
              <p className='md:flex'>
                <span className='w-60 pl-2 md:pl-[7.05rem]'>To:</span>
                <ValueDisplay
                  value={to}
                  error={txError}
                />
              </p>
            </div>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='md:flex'>
                <span className='w-60 text-nowrap'>Transaction Fee:</span>
                <span className='ml-2 md:ml-0'>
                  <ValueDisplay
                    value={txFee}
                    error={txError || txReceiptError}
                  />
                </span>
              </p>
            </li>
            <div className='ml-4 pt-2 md:pt-0'>
              <p className='md:flex'>
                <span className='w-60 pl-2 md:pl-[3.7rem]'>Gas Price:</span>
                <span className='ml-2 md:ml-0'>
                  <ValueDisplay
                    value={gasPrice}
                    error={txError}
                  />
                </span>
              </p>
            </div>
            <div className='ml-4 pt-2 md:pt-0'>
              <p className='md:flex'>
                <span className='w-60 pl-2 md:pl-[3.65rem]'>Gas Used:</span>
                <span className='ml-2 md:ml-0'>
                  <ValueDisplay
                    value={gasUsed}
                    error={txReceiptError}
                  />
                </span>
              </p>
            </div>
          </ul>
        </div>
      </div>
    </main>
  );
}
