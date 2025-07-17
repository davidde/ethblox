'use client';

import { useEffect, useState } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import { type Block } from 'alchemy-sdk';
import {
  getSecsFromUnixSecs,
  getBlockAgeFromSecs,
  truncateAddress,
  getEtherValueFromWei,
  getBlockRewardUrl,
  getAlchemy,
  DataState,
  getErrorState,
} from '@/lib/utilities';
import Link from 'next/link';
import PopoverLink from '../../../common/popover-link';
import ValueDisplay from '@/components/common/value-display';
import LoadingIndicator from '@/components/common/loading-indicator';
import ErrorIndicator from '@/components/common/error-indicator';


export default function Block(props: {
  blockNumber: number,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const blockRewardUrl = getBlockRewardUrl(props.network, props.blockNumber);

  // Calling `DataState.value()` inside is required to get a
  // `DataState<undefined>` instead of an `undefined`!
  // type DataState<T> = ValueState<T> | ErrorState
  // ValueState<T>.value either has value<T> OR undefined -> LoadingState!
  // ErrorState.error either has an Error object or undefined
  const [block, setBlock] = useState(DataState.value<Block>());
  const [blockReward, setBlockReward] = useState(DataState.value<string>());

  useEffect(() => {
    if (props.blockNumber) (async () => {
      try {
        const resp = await alchemy.core.getBlock(props.blockNumber);
        setBlock(DataState.value(resp));
      } catch(err) {
        setBlock(getErrorState(err));
      }
      try {
        const resp = await fetch(blockRewardUrl);
        if (!resp.ok) throw new Error(`Response NOT OK, status: ${resp.status}`);
        const data = await resp.json();
        if (!data.result.blockReward) throw new Error('Block reward missing from response.');
        setBlockReward(DataState.value(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`));
      } catch(err) {
        setBlockReward(getErrorState(err));
      }
    })();
  }, [alchemy, props.blockNumber, blockRewardUrl]);

  return (
    <div className='min-h-[8.5rem] md:min-h-[5.8rem] p-2 md:p-3 border-b border-(--border-color) last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <CubeIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex md:flex-col ml-2 pt-1 md:pt-0 md:w-32'>
            <span className='px-2 md:px-4 leading-5'>
              <Link
                href={`/${props.network}/block?number=${props.blockNumber}`}
                className='text-(--link-color) hover:text-(--hover-fg-color)'
              >
                {props.blockNumber}
              </Link>
            </span>
            <span className='md:pl-4 text-sm text-(--grey-fg-color)'>
              <ValueDisplay
                value={block.value ? `(${getBlockAgeFromSecs(getSecsFromUnixSecs(block.value.timestamp))} ago)` : null}
                error={block.error?.message}
                err='Error'
              />
            </span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'>
            <ValueDisplay
              value={block.value ? `${block.value.transactions.length} transactions` : null}
              error={block.error?.message}
              err='Error'
            />
          </span>
          <span className='pl-2 md:pl-4'>
            Block Reward: &nbsp;
            <ValueDisplay
              value={blockReward.value}
              error={blockReward.error?.message}
              err='Error'
            />
          </span>
          <span className='pl-2 md:pl-4 leading-5'>
            Recipient:&nbsp;
            {
              block.value ?
                <PopoverLink
                  href={`/${props.network}/address?hash=${block.value.miner}`}
                  content={truncateAddress(block.value.miner, 20)}
                  popover={block.value.miner}
                  className='left-[-37%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />
                :
                block.error ?
                  <ErrorIndicator error='Error' />
                  :
                  <LoadingIndicator />
            }
          </span>
        </div>
      </div>
    </div>
  );
}