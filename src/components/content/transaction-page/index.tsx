'use client';

import { useState, useEffect } from 'react';
import { getAlchemy } from '@/lib/utilities';
import { Utils, TransactionResponse, TransactionReceipt } from 'alchemy-sdk';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GreenSpan from '@/components/common/green-span';
import RedSpan from '@/components/common/red-span';
import ValueDisplay from '@/components/common/value-display';
import BreakMobile from '@/components/common/break-mobile';


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
      <GreenSpan className='w-[6.4rem]'>
        Success
      </GreenSpan>
      :
      <RedSpan className='w-[5rem]'>
        Fail
      </RedSpan>;

    gasUsed = `${+Utils.formatEther(txReceipt.gasUsed) * Math.pow(10, 9)} Gwei (Ξ${Utils.formatEther(txReceipt.gasUsed)})`;

    if (tx) txFee = `Ξ${Utils.formatEther(tx.gasPrice!.mul(txReceipt.gasUsed))} (= Gas Price * Gas Used)`;
  }

  let block, confirmations, value, from, to, gasPrice;
  if (tx) {
    block = <Link href={`/${props.network}/block?number=${tx.blockNumber}`}
             className='text-(--link-color) hover:text-(--hover-fg-color)'>
              {tx.blockNumber}</Link>;
    confirmations = tx.confirmations;
    value = `Ξ${Utils.formatEther(tx.value)}`;
    from = <Link href={`/${props.network}/address?hash=${tx.from}`}
            className='break-all font-mono text-(--link-color) hover:text-(--hover-fg-color)'>
              {tx.from}
            </Link>;
    to = <Link href={`/${props.network}/address?hash=${tx.to}`}
          className='break-all font-mono text-(--link-color) hover:text-(--hover-fg-color)'>
            {tx.to}
          </Link>;
    gasPrice = `${+Utils.formatEther(tx.gasPrice!) * Math.pow(10, 9)} Gwei (Ξ${Utils.formatEther(tx.gasPrice!)})`;
  }

  return (
    <main>
      <div className='flex items-center justify-center w-full px-[0.5rem] md:px-8'>
        <div className='p-4 md:p-8 w-full max-w-[calc(100vw-1rem)] md:max-w-[62rem]
         border border-(--border-color) bg-(--comp-bg-color) rounded-lg'>
          <h1 className='text-lg font-bold'>
            Transaction Details
          </h1>
          <ul className='max-w-[90vw] break-words mt-8'>
            <li className='list-disc ml-4 m-2'>
              <div className='flex flex-col md:flex-row'>
                <span className='min-w-35 md:min-w-60'>Transaction Hash:</span>
                <span className='font-semibold'>{hash}</span>
              </div>
            </li>
            <div className='ml-4'>
              <div className='flex h-[2.2rem]'>
                <span className='min-w-20 md:min-w-60 md:pl-21'>Status:</span>
                <ValueDisplay
                  value={status}
                  error={txReceiptError}
                  fallbackClass=''
                />
              </div>
            </div>
            <li className='list-disc ml-4 mt-4 m-2'>
              <div className='flex'>
                <span className='min-w-20 md:min-w-60'>Block:</span>
                <span>
                  <ValueDisplay
                    value={block}
                    error={txError}
                  />
                </span>
              </div>
            </li>
            <div className='ml-4'>
              <div className='flex'>
                <span className='min-w-35 md:min-w-60 md:pl-[1.55rem]'>Confirmations:</span>
                <span>
                  <ValueDisplay
                    value={confirmations}
                    error={txError}
                  />
                </span>
              </div>
            </div>
            <li className='list-disc ml-4 mt-4 m-2'>
              <div className='flex'>
                <span className='min-w-20 md:min-w-60'>Value:</span>
                <span>
                  <ValueDisplay
                    value={value}
                    error={txError}
                  />
                </span>
              </div>
            </li>
            <div className='ml-4'>
              <div className='flex min-h-[3rem] md:min-h-auto'>
                <span className='min-w-20 md:min-w-60 pl-4 md:pl-[5.8rem]'>From:</span>
                <ValueDisplay
                  value={from}
                  error={txError}
                />
              </div>
            </div>
            <div className='ml-4 pt-2 md:pt-0'>
              <div className='flex min-h-[3rem] md:min-h-auto'>
                <span className='min-w-20 md:min-w-60 pl-[2.125rem] md:pl-[7.05rem]'>To:</span>
                <ValueDisplay
                  value={to}
                  error={txError}
                />
              </div>
            </div>
            <li className='list-disc ml-4 mt-4 m-2'>
              <div className='flex flex-wrap md:flex-nowrap min-h-[3rem] md:min-h-auto'>
                <span className='min-w-35 md:min-w-60 text-nowrap'>Transaction Fee:</span>
                <div className='basis-full md:hidden' />
                <span className='pl-4 md:pl-0'>
                  <ValueDisplay
                    value={txFee}
                    error={txError || txReceiptError}
                  />
                </span>
              </div>
            </li>
            <div className='ml-4 pt-2 md:pt-0'>
              <div className='flex'>
                <span className='min-w-25 md:min-w-60 md:pl-[3.7rem]'>Gas Price:</span>
                <span>
                  <ValueDisplay
                    value={gasPrice}
                    error={txError}
                  />
                </span>
              </div>
            </div>
            <div className='ml-4 pt-2 md:pt-0'>
              <div className='flex min-h-[3rem] md:min-h-auto'>
                <span className='min-w-25 md:min-w-60 md:pl-[3.65rem]'>Gas Used:</span>
                <span>
                  <ValueDisplay
                    value={gasUsed}
                    error={txReceiptError}
                  />
                </span>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </main>
  );
}
