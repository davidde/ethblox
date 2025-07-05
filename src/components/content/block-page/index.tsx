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
import { useState, useEffect } from 'react';
import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';


export default function BlockPage(props: { network: string }) {
  const searchParams = useSearchParams();
  const number = +(searchParams.get('number') ?? 0);
  const [error, setError] = useState('');

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
    async function getBlockData() {
      try {
        const alchemy: Alchemy = getAlchemy(props.network);
        const blockData = await alchemy.core.getBlock(number);
        setBlock(blockData);
        const finalizedBlockData = await alchemy.core.getBlock('finalized');
        setFinalizedBlock(finalizedBlockData);

        const response = await fetch(blockRewardUrl);
        if (!response.ok) throw new Error(`getBlockReward() Error: ${response.status}`);
        const data = await response.json();
        if (data.result.blockReward)
          setBlockReward(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`);
      } catch (err) {
        const error = 'BlockPage ' + err;
        console.error(error);
        setError(error);
      }
    }

    getBlockData();
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
        <ErrorIndicator error={error} />
        <h1 className='text-lg font-bold mt-8'>
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
              <span>{block?.hash ?? <LoadingIndicator />}
              </span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Status:</span>
              {
                finalized ?
                  <span className='bg-green-200 text-green-700 border-green-400
                              dark:bg-green-400 dark:text-green-800 dark:border-green-800
                              border rounded-md p-1 px-4 w-[6.4rem]'>
                    Finalized
                  </span>
                  :
                  finalized === false ?
                    <span className='bg-red-200 text-red-700 border-red-400
                              dark:bg-red-500 dark:text-red-100 dark:border-red-300
                                border rounded-md p-1 px-4 w-[7.6rem]'>
                      Unfinalized
                    </span>
                    :
                    <LoadingIndicator /> // Undefined case (initial render)
              }
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Timestamp:</span>
              <span>{timestamp ? timestamp : <LoadingIndicator />}</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Fee recipient:</span>
              {
                block?.miner ?
                  <Link
                    href={`/${props.network}/address?hash=${block.miner}`}
                    className='font-mono text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
                  >
                    {block.miner}
                  </Link>
                  :
                  <LoadingIndicator />
              }
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>

              <span className='w-60'>Block reward:</span>
              <span>{blockReward ? blockReward : <LoadingIndicator />}</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Gas Used:</span>
              <span>{gasUsed ? gasUsed : <LoadingIndicator />}</span>
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}
