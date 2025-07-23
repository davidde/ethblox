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
} from '@/lib/utilities';
import DataState from '@/lib/data-state';
import Link from 'next/link';
import PopoverLink from '../../../common/popover-link';


export default function Block(props: {
  blockNumber: number,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const blockRewardUrl = getBlockRewardUrl(props.network, props.blockNumber);

  // Calling `DataState.value()` inside `useState()` is required
  // to get a `DataState<undefined>` instead of an `undefined`!
  const [block, setBlock] = useState(DataState.value<Block>());
  const [blockReward, setBlockReward] = useState(DataState.value<string>());

  useEffect(() => {
    if (props.blockNumber) (async () => {
      try {
        const resp = await alchemy.core.getBlock(props.blockNumber);
        setBlock(DataState.value(resp));
      } catch(err) {
        setBlock(DataState.error(err));
      }
      try {
        const resp = await fetch(blockRewardUrl);
        if (!resp.ok) throw new Error(`Response NOT OK, status: ${resp.status}`);
        const data = await resp.json();
        if (!data.result || !data.result.blockReward) throw new Error('Block reward missing from response.');
        setBlockReward(DataState.value(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`));
      } catch(err) {
        setBlockReward(DataState.error(err));
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
              <block.Render
                value={() => <Link href={`/${props.network}/block?number=${block.value!.number}`}
                                   className='text-(--link-color) hover:text-(--hover-fg-color)'>
                                {block.value!.number}
                             </Link>}
                error={'Error'}
              />
            </span>
            <span className='md:pl-4 text-sm text-(--grey-fg-color)'>
              <block.Render
                value={() => `(${getBlockAgeFromSecs(getSecsFromUnixSecs(block.value!.timestamp))} ago)`}
                error={'Error'}
              />
            </span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'>
            <block.Render
              value={() => `${block.value!.transactions.length} transactions`}
              error={'Error'}
            />
          </span>
          <span className='pl-2 md:pl-4'>
            Block Reward: &nbsp;
            <blockReward.Render error={'Error'} />
          </span>
          <span className='pl-2 md:pl-4 leading-5'>
            Recipient:&nbsp;
            <block.Render
              value={() =>
                <PopoverLink
                  href={`/${props.network}/address?hash=${block.value!.miner}`}
                  content={truncateAddress(block.value!.miner, 20)}
                  popover={block.value!.miner}
                  className='left-[-37%] top-[-2.6rem] w-78 py-1.5 px-2.5'
                />}
              error={'Error'}
            />
          </span>
        </div>
      </div>
    </div>
  );
}