'use client';

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
import { useState, useEffect, JSX } from 'react';
import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';
import GreenSpan from '@/components/common/green-span';
import RedSpan from '@/components/common/red-span';


export default function BlockPage(props: { network: string }) {
  const searchParams = useSearchParams();
  const number = +(searchParams.get('number') ?? 0);
  const [blockError, setBlockError] = useState('');
  const [finalizedError, setFinalizedError] = useState('');
  const [blockRewardError, setBlockRewardError] = useState('');

  const blockRewardUrl = getBlockRewardUrl(props.network, number);

  const [block, setBlock] = useState<Block>();
  const [finalizedBlock, setFinalizedBlock] = useState<Block>();
  const [blockReward, setBlockReward] = useState('');

  useEffect(() => {
    (async () => {
      const alchemy = getAlchemy(props.network);
      try {
        const blockData = await alchemy.core.getBlock(number);
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
        const error = "BlockPage getBlock('finalized')" + err;
        console.error(error);
        setFinalizedError(error);
      }
      try {
        const res = await fetch(blockRewardUrl);
        if (!res.ok) throw new Error(`Response NOT OK, status: ${res.status}`);
        const data = await res.json();
        if (data.result.blockReward) {
          setBlockReward(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`);
        }
      } catch (err) {
        const error = 'BlockPage getBlockReward()' + err;
        console.error(error);
        setBlockRewardError(error);
      }
    })();
  }, [number, blockRewardUrl, props.network]);

  let timestamp, gasUsed;
  if (block) {
    const secs = getSecsFromUnixSecs(block.timestamp);
    timestamp = `${getBlockAgeFromSecs(secs)} ago (${getDateFromUnixSecs(block.timestamp)})`;
    const gasUsedEther = Utils.formatEther(block.gasUsed);
    gasUsed = `${+gasUsedEther * Math.pow(10, 9)} Gwei (Ξ${gasUsedEther})`;
  }
  let finalized;
  if (finalizedBlock) finalized = number <= finalizedBlock.number;

  return (
    <main>
      <div className='flex items-center justify-center w-full px-[0.5rem] md:px-8'>
        <div className='p-4 md:p-8 w-full max-w-[calc(100vw-1rem)] md:max-w-[62rem]
         border border-(--border-color) bg-(--comp-bg-color) rounded-lg'>
          <h1 className='text-lg font-bold'>
            Block Details
          </h1>
          <ul className='max-w-[90vw] break-words mt-8'>
            <li className='list-disc ml-4 m-2'>
              <p className='flex flex-col md:flex-row'>
                <span className='min-w-60'>Block number:</span>
                <span>{number}</span>
              </p>
            </li>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='flex flex-col md:flex-row'>
                <span className='min-w-60'>Block hash:</span>
                <span className='break-all min-h-[4.5rem] md:min-h-[3.3rem]'>
                  {block?.hash || (blockError ?
                                  <ErrorIndicator error={blockError} />
                                  :
                                  <LoadingIndicator />)}
                </span>
              </p>
            </li>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='flex'>
                <span className='min-w-20 md:min-w-60 min-h-[3rem] md:min-h-[2.2rem]'>Status:</span>
                {
                  finalized ?
                    <GreenSpan className='border rounded-md p-1 px-4 w-[6.4rem] h-[2.2rem]'>
                      Finalized
                    </GreenSpan>
                    :
                    finalized === false ?
                      <RedSpan className='border rounded-md p-1 px-4 w-[7.6rem] h-[2.2rem]'>
                        Unfinalized
                      </RedSpan>
                      :
                      finalizedError ?
                        <ErrorIndicator error={finalizedError} /> // Undefined case: error
                        :
                        <LoadingIndicator /> // Undefined case: initial render
                }
              </p>
            </li>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='flex flex-col md:flex-row'>
                <span className='min-w-60'>Timestamp:</span>
                <span className='min-h-[4.5rem] md:min-h-[3.3rem]'>
                  {timestamp || (blockError ?
                                <ErrorIndicator error={blockError} />
                                :
                                <LoadingIndicator />)}
                </span>
              </p>
            </li>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='flex flex-col md:flex-row'>
                <span className='min-w-60'>Fee recipient:</span>
                <span className='min-h-[3.3rem] md:min-h-auto'>
                {
                  block?.miner ?
                    <Link
                      href={`/${props.network}/address?hash=${block.miner}`}
                      className='font-mono text-(--link-color) hover:text-(--hover-fg-color)'
                    >
                      {block.miner}
                    </Link>
                    :
                    (blockError ?
                      <ErrorIndicator error={blockError} />
                      :
                      <LoadingIndicator />)
                }
                </span>
              </p>
            </li>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='flex flex-col md:flex-row'>

                <span className='min-w-60'>Block reward:</span>
                <span>
                  {blockReward || (blockRewardError ?
                                  <ErrorIndicator error={blockRewardError} />
                                  :
                                  <LoadingIndicator />)}
                </span>
              </p>
            </li>
            <li className='list-disc ml-4 mt-4 m-2'>
              <p className='flex flex-col md:flex-row'>
                <span className='min-w-60'>Gas Used:</span>
                <span className='min-h-[3.3rem] md:min-h-auto'>
                  {gasUsed || (blockError ?
                              <ErrorIndicator error={blockError} />
                              :
                              <LoadingIndicator />)}
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
