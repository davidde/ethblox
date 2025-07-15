'use client';

import { useState, useEffect } from 'react';
import { Utils, Block } from 'alchemy-sdk';
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
    const gasUsedEther = Utils.formatEther(block.gasUsed);
    gasUsed = `${+gasUsedEther * Math.pow(10, 9)} Gwei (Ξ${gasUsedEther})`;
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
      <div className='flex items-center justify-center w-full px-[0.5rem] md:px-8'>
        <div className='p-4 md:p-8 w-full max-w-[calc(100vw-1rem)] md:max-w-[62rem]
         border border-(--border-color) bg-(--comp-bg-color) rounded-lg'>
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
              <p className='flex'>
                <span className='min-w-20 md:min-w-60 min-h-[3rem] md:min-h-[2.2rem]'>
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
        </div>
      </div>
    </main>
  );
}
