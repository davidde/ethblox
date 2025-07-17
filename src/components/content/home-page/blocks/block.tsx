'use client';

import { useEffect, useState } from 'react';
import { CubeIcon } from '@heroicons/react/24/outline';
import { type Block } from 'alchemy-sdk';
import {
  getSecsFromUnixSecs,
  truncateAddress,
  getEtherValueFromWei,
  getBlockRewardUrl,
  getAlchemy
} from '@/lib/utilities';
import Link from 'next/link';
import PopoverLink from '../../../common/popover-link';


export default function Block(props: {
  blockNumber: number,
  network: string,
}) {
  const alchemy = getAlchemy(props.network);
  const blockRewardUrl = getBlockRewardUrl(props.network, props.blockNumber);

  const [block, setBlock] = useState<Block>();
  const [blockReward, setBlockReward] = useState('');
  const [blockRewardError, setBlockRewardError] = useState('');
  const [blockError, setBlockError] = useState('');

  useEffect(() => {
    if (props.blockNumber) (async () => {
      try {
        const resp = await alchemy.core.getBlock(props.blockNumber);
        setBlock(resp);
      } catch(err) {
        const error = 'HomePage Block getBlock() ' + err;
        console.error(error);
        setBlockError(error);
      }
      try {
        const resp = await fetch(blockRewardUrl);
        if (!resp.ok) throw new Error(`Error: Response NOT OK, status: ${resp.status}`);
        const data = await resp.json();
        if (!data.result.blockReward) throw new Error('Error: Block reward missing from response.');
        setBlockReward(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`);
      } catch(err) {
        const error = 'HomePage Block getBlockReward() ' + err;
        console.error(error);
        setBlockRewardError(error);
      }
    })();
  }, [alchemy, props.blockNumber, blockRewardUrl]);

  let secsSinceAdded, recipient, recipientShort;
  if (block) {
    secsSinceAdded = getSecsFromUnixSecs(block.timestamp);
    recipient = block.miner;
    recipientShort = truncateAddress(recipient, 20);
  }

  return (
    <div className='p-2 md:p-3 border-b border-(--border-color) last:border-0'>
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
            <span className='md:pl-4 text-sm text-(--grey-fg-color)'>({secsSinceAdded} secs ago)</span>
          </div>
        </div>

        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'>{block?.transactions.length} transactions</span>
          <span className='pl-2 md:pl-4'>
            Block Reward: { blockReward !== undefined && blockReward !== null ? blockReward : 'TBD' }
          </span>
          <span className='pl-2 md:pl-4 leading-5'>
            Recipient:&nbsp;
            <PopoverLink
              href={`/${props.network}/address?hash=${recipient}`}
              content={recipientShort ?? ''}
              popover={recipient ?? ''}
              className='left-[-37%] top-[-2.6rem] w-78 py-1.5 px-2.5'
            />
          </span>
        </div>
      </div>
    </div>
  );
}