'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import {  BlockWithTransactions } from 'alchemy-sdk';
import { truncateAddress, truncateTransaction, getEtherValueFromWei } from '@/lib/utilities';
import PopoverLink from '@/components/common/popover-link';
import { DataState } from '@/lib/data-state';


export default function Transaction(props: {
  id: number,
  network: string,
  blockWithTransactionsData: DataState<BlockWithTransactions>,
}) {
  const txData = props.blockWithTransactionsData.useTransform(
    (data, id) => ({ ...data.transactions[id] }),
    [props.id]
  );

  return (
    <div className='md:min-h-[4.825rem] p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <DocumentTextIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex flex-col ml-2 pt-1 md:pt-0 md:w-48'>
            <span className='px-2 md:px-4'>
              <txData.Render className='text-(--link-color) w-[10rem]'>
                {
                  (data) =>
                    <PopoverLink
                      href={`/${props.network}/transaction?hash=${data.hash}`}
                      content={truncateTransaction(data.hash, 18)}
                      popover={data.hash}
                      className='-left-full top-[-2.6rem] w-120 py-1.5 px-2.5'
                    />
                }
              </txData.Render>
            </span>
            <span className='px-2 md:pl-4'>
              <txData.Render
                staticContent='Amount:'
                loadingPulseColor='bg-(--grey-fg-color)'
              />
              &nbsp;&nbsp;
              <txData.Render className='text-(--grey-fg-color) w-[3rem]'>
                { (data) => `Ξ${getEtherValueFromWei(data.value, 6)}` }
              </txData.Render>
            </span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-4 my-2 md:my-0'>
          <span className='pl-2 md:pl-4'>
            <txData.Render
              staticContent='From:'
              loadingPulseColor='bg-(--grey-fg-color)'
            />
            &nbsp;&nbsp;
            <txData.Render className='text-(--link-color) w-[11.25rem]'>
              {
                (data) =>
                  <PopoverLink
                    href={`/${props.network}/address?hash=${data.from}`}
                    content={truncateAddress(data.from, 21)}
                    popover={data.from}
                    className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                  />
              }
            </txData.Render>
          </span>
          <span className='pl-7 md:pl-9'>
            <txData.Render
              staticContent='To:'
              loadingPulseColor='bg-(--grey-fg-color)'
            />
            &nbsp;&nbsp;
            <txData.Render className='text-(--link-color) w-[11.25rem]'>
              {
                (data) => data.to ?
                  <PopoverLink
                    href={`/${props.network}/address?hash=${data.to}`}
                    content={truncateAddress(data.to, 21)}
                    popover={data.to}
                    className='left-[-35%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                  />
                  : <span>/</span>
              }
            </txData.Render>
          </span>
        </div>
      </div>
    </div>
  );
}