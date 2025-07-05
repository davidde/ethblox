'use client';

import { Alchemy, Utils, Block } from 'alchemy-sdk';
import Link from 'next/link';
import {
  getDateFromUnixSecs,
  getSecsFromUnixSecs,
  getBlockAgeFromSecs,
  getEtherValueFromWei,
  getAlchemy
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

  const blockRewardUrl = props.network === 'mainnet' ?
    `https://eth.blockscout.com/api?module=block&action=getblockreward&blockno=${number}`
    :
    `https://api-sepolia.etherscan.io/api?module=block&action=getblockreward` +
    `&blockno=${number}` +
    `&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`;

  const [block, setBlock] = useState<Block>();
  const [finalizedBlock, setFinalizedBlock] = useState<Block>();
  const [blockReward, setBlockReward] = useState('');

  useEffect(() => {
    (async () => {
      const alchemy: Alchemy = getAlchemy(props.network);
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
        const error = "BlockPage getBlock('finalized') " + err;
        console.error(error);
        setFinalizedError(error);
      }
      try {
        const response = await fetch(blockRewardUrl);
        if (!response.ok) throw new Error(`HTTP fetch error: ${response.status}`);
        const data = await response.json();
        if (data.result.blockReward) {
          setBlockReward(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`);
        }
      } catch (err) {
        const error = 'BlockPage getBlockReward() ' + err;
        console.error(error);
        setBlockRewardError(error);
      }
    })();
  }, [number, blockRewardUrl, props.network]);

  let timestamp = ''; let gasUsed = '';
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
      <div className='m-4 mt-8 md:m-8'>
        <h1 className='text-lg font-bold'>
          Block Details
        </h1>
        <ul className='max-w-[90vw] break-words mt-8'>
          <li className='list-disc ml-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Block number:</span>
              <span>{number}</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Block hash:</span>
              <span>{block?.hash || (blockError ?
                                  <ErrorIndicator error={blockError} />
                                  :
                                  <LoadingIndicator />)}
              </span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Status:</span>
              {
                finalized ?
                  <GreenSpan className='border rounded-md p-1 px-4 w-[6.4rem]'>
                    Finalized
                  </GreenSpan>
                  :
                  finalized === false ?
                    <RedSpan className='border rounded-md p-1 px-4 w-[7.6rem]'>
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
              <span className='w-60'>Timestamp:</span>
              <span>{timestamp || (blockError ?
                                  <ErrorIndicator error={blockError} />
                                  :
                                  <LoadingIndicator />)}
              </span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Fee recipient:</span>
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
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>

              <span className='w-60'>Block reward:</span>
              <span>
                {
                    blockReward || (blockRewardError ?
                                    <ErrorIndicator error={blockRewardError} />
                                    :
                                    <LoadingIndicator />)
                }
              </span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Gas Used:</span>
              <span>{gasUsed || (blockError ?
                                  <ErrorIndicator error={blockError} />
                                  :
                                  <LoadingIndicator />)}
              </span>
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}
