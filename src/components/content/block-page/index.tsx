'use client';

import { useState, useEffect } from 'react';
import { Block } from 'alchemy-sdk';
import Link from 'next/link';
import {
  getDateFromUnixSecs,
  getSecsFromUnixSecs,
  getBlockAgeFromSecs,
  getEtherValueFromWei,
  getAlchemy,
  getBlockRewardUrl
} from '@/lib/utilities';
import { useSearchParams } from 'next/navigation';
import GreenSpan from '@/components/common/green-span';
import RedSpan from '@/components/common/red-span';
import ValueDisplay from '@/components/common/value-display';
import PageWrapper from '@/components/common/page-wrapper';


export default function BlockPage(props: { network: string }) {
  const alchemy = getAlchemy(props.network);
  const searchParams = useSearchParams();
  const blockNum = +(searchParams.get('number') ?? 0);
  const blockRewardUrl = getBlockRewardUrl(props.network, blockNum);

  const [block, setBlock] = useState<Block>();
  const [finalizedBlock, setFinalizedBlock] = useState<Block>();
  const [blockReward, setBlockReward] = useState('');

  const [blockError, setBlockError] = useState('');
  const [finalizedError, setFinalizedError] = useState('');
  const [blockRewardError, setBlockRewardError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const blockData = await alchemy.core.getBlock(blockNum);
        setBlock(blockData);
      } catch (err) {
        const error = 'BlockPage getBlock() ' + err;
        console.error(error);
        setBlockError(error);
      }
      try {
        const finalizedBlockData = await alchemy.core.getBlock('finalized');
        setFinalizedBlock(finalizedBlockData);
      } catch (err) {
        const error = "BlockPage getBlock('finalized') " + err;
        console.error(error);
        setFinalizedError(error);
      }
      try {
        const res = await fetch(blockRewardUrl);
        if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
        const data = await res.json();
        if (!data.result.blockReward) throw new Error('Block reward missing from response.');
        setBlockReward(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`);
      } catch (err) {
        const error = 'BlockPage getBlockReward() ' + err;
        console.error(error);
        setBlockRewardError(error);
      }
    })();
  }, [alchemy, blockNum, blockRewardUrl]);

  let timestamp, gasUsed;
  if (block) {
    const secs = getSecsFromUnixSecs(block.timestamp);
    timestamp = `${getBlockAgeFromSecs(secs)} ago (${getDateFromUnixSecs(block.timestamp)})`;
    gasUsed = (+block.gasUsed).toLocaleString('en-US');
  }
  let finalized;
  if (finalizedBlock) {
    finalized = blockNum <= finalizedBlock.number ?
      <GreenSpan className='w-[6.4rem]'>
        Finalized
      </GreenSpan>
      :
      <RedSpan className='w-[7.6rem]'>
        Unfinalized
      </RedSpan>;
  }
  let recipient = block?.miner ?
    <Link href={`/${props.network}/address?hash=${block.miner}`}
      className='font-mono text-(--link-color) hover:text-(--hover-fg-color)'>
      {block.miner}
    </Link>
    :
    undefined;

  return (
    <main>
      <PageWrapper>
        <h1 className='text-lg font-bold'>
          Block Details
        </h1>
        <ul className='max-w-[90vw] break-words mt-8'>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex'>
              <span className='min-w-35 md:min-w-60'>Block number:</span>
              <span className='font-semibold'>{blockNum}</span>
            </p>
          </li>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='min-w-60'>Block hash:</span>
              <span className='break-all min-h-[4.5rem] md:min-h-[3.3rem]'>
                <ValueDisplay
                  value={block?.hash}
                  error={blockError}
                />
              </span>
            </p>
          </li>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex h-[2.2rem]'>
              <span className='min-w-20 md:min-w-60'>
                Status:
              </span>
              <ValueDisplay
                value={finalized}
                error={finalizedError}
                err='Error getting final block'
              />
            </p>
          </li>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='min-w-60'>Timestamp:</span>
              <span className='min-h-[4.5rem] md:min-h-[3.3rem]'>
                <ValueDisplay
                  value={timestamp}
                  error={blockError}
                />
              </span>
            </p>
          </li>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='min-w-60'>Fee recipient:</span>
              <span className='min-h-[3.3rem] md:min-h-auto'>
                <ValueDisplay
                  value={recipient}
                  error={blockError}
                />
              </span>
            </p>
          </li>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex'>
              <span className='min-w-35 md:min-w-60'>Block reward:</span>
              <span>
                <ValueDisplay
                  value={blockReward}
                  error={blockRewardError}
                  err='Error fetching'
                />
              </span>
            </p>
          </li>

          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='min-w-60'>Gas Used:</span>
              <span className='min-h-[3.3rem] md:min-h-auto'>
                <ValueDisplay
                  value={gasUsed}
                  error={blockError}
                />
              </span>
            </p>
          </li>

        </ul>
      </PageWrapper>
    </main>
  );
}
