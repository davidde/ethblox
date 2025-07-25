'use client';

import { CubeIcon } from '@heroicons/react/24/outline';
import { type Block } from 'alchemy-sdk';
import {
  getSecsFromUnixSecs,
  getBlockAgeFromSecs,
  truncateAddress,
  getAlchemy,
} from '@/lib/utilities';
import { useDataState, DataState } from '@/lib/data-state';
import Link from 'next/link';
import PopoverLink from '../../../common/popover-link';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import LoadingPulseStatic from '@/components/common/indicators/loading-pulse-static';
import ErrorWithRetry from '@/components/common/indicators/error-with-retry';
import BlockReward from './block-reward';


export default function Block(props: {
  id: number,
  latestBlockData: DataState<number>,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const blockNumber = props.latestBlockData.value ? props.latestBlockData.value - props.id : undefined;

  const block = useDataState({
    fetcher: (num) => alchemy.core.getBlock(num),
    args: [blockNumber!],
    skipFetch: !blockNumber
  });

  return (
    <div className='min-h-[8.5rem] md:min-h-[5.8rem] p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <CubeIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex md:flex-col ml-2 pt-1 md:pt-0 md:w-32'>
            <span className='px-2 md:px-4 leading-5'>
              <props.latestBlockData.Render
                value={() => <Link href={`/${props.network}/block?number=${blockNumber}`}
                                   className='text-(--link-color) hover:text-(--hover-fg-color)'>
                                {blockNumber}
                             </Link>}
                loadingFallback={<LoadingPulse className='bg-(--link-color) w-[5rem]' />}
              />
            </span>
            <span className='md:pl-4 text-sm text-(--grey-fg-color)'>
              <block.Render
                value={() => `(${getBlockAgeFromSecs(getSecsFromUnixSecs(block.value!.timestamp))} ago)`}
                loadingFallback={<LoadingPulse className='bg-(--grey-fg-color) w-[6rem]' />}
                errorFallback={<ErrorWithRetry refetch={block.refetch} />}
              />
            </span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'>
            <block.Render
              value={() => `${block.value!.transactions.length} transactions`}
              loadingFallback={<LoadingPulse className='bg-(--grey-fg-color) w-[8rem]' />}
              errorFallback={<ErrorWithRetry refetch={block.refetch} />}
            />
          </span>
          <BlockReward
            id={props.id}
            network={props.network}
            blockNumber={blockNumber}
          />
          <span className='pl-2 md:pl-4 leading-5'>
            <LoadingPulseStatic
              content='Recipient:'
              dataState={block}
              className='bg-(--grey-fg-color)'
            />
            &nbsp;&nbsp;
            <block.Render
              value={() =>
                <PopoverLink
                  href={`/${props.network}/address?hash=${block.value!.miner}`}
                  content={truncateAddress(block.value!.miner, 20)}
                  popover={block.value!.miner}
                  className='left-[-37%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />}
              loadingFallback={<LoadingPulse className='bg-(--link-color) w-[11rem]' />}
              errorFallback={<ErrorWithRetry refetch={block.refetch} />}
            />
          </span>
        </div>
      </div>
    </div>
  );
}