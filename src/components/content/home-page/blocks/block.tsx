'use client';

import { CubeIcon } from '@heroicons/react/24/outline';
import type { Alchemy, Block } from 'alchemy-sdk';
import {
  getSecsFromUnixSecs,
  getBlockAgeFromSecs,
  truncateAddress,
  useAlchemy,
} from '@/lib/utilities';
import { useDataState, DataState } from '@/lib/data-state';
import Link from 'next/link';
import PopoverLink from '../../../common/popover-link';
import LoadingPulseStatic from '@/components/common/indicators/loading-pulse-static';
import ErrorWithRefetch from '@/components/common/indicators/error-with-refetch';
import BlockReward from './block-reward';


export default function Block(props: {
  id: number,
  latestBlockData: DataState<number>,
  network: string,
}) {
  const alchemy = useAlchemy(props.network);
  const blockNumber = props.latestBlockData.value && props.latestBlockData.value - props.id;

  const blockData = useDataState<Block, [Alchemy, number?]>({
    fetcher: (alchemy, num) => alchemy.core.getBlock(num!),
    args: [alchemy, blockNumber],
  });

  return (
    <div className='min-h-[8.5rem] md:min-h-[5.8rem] p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <CubeIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex md:flex-col ml-2 pt-1 md:pt-0 md:w-[8rem] px-2 md:px-4'>
            <span className='leading-5'>
              <props.latestBlockData.Render
                value={(className) => <Link href={`/${props.network}/block?number=${blockNumber}`}
                                   className={`${className} hover:text-(--hover-fg-color)`}>
                                {blockNumber}
                             </Link>}
                className='text-(--link-color) w-[5em]'
              />
            </span>
            <span className='text-sm text-(--grey-fg-color)'>
              <blockData.Render
                value={() => `(${getBlockAgeFromSecs(getSecsFromUnixSecs(blockData.value!.timestamp))} ago)`}
                className='w-[6em]'
              />
            </span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <BlockReward
            id={props.id}
            network={props.network}
            blockNumber={blockNumber}
          />
          <span className='px-2 md:px-4 leading-5'>
            <blockData.Render
              value={() => `${blockData.value!.transactions.length} transactions`}
              className='text-(--grey-fg-color) w-[8rem]'
            />
          </span>
          <span className='pl-2 md:pl-4 leading-5'>
            <LoadingPulseStatic
              content='Recipient:'
              dataState={blockData}
              className='text-(--grey-fg-color)'
            />
            &nbsp;&nbsp;
            <blockData.Render
              value={() =>
                <PopoverLink
                  href={`/${props.network}/address?hash=${blockData.value!.miner}`}
                  content={truncateAddress(blockData.value!.miner, 20)}
                  popover={blockData.value!.miner}
                  className='left-[-37%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />}
              className='text-(--link-color) w-[11rem]'
            />
          </span>
        </div>
      </div>
    </div>
  );
}