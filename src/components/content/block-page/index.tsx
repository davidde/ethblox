'use client';

import { Alchemy, Utils, Block } from 'alchemy-sdk';
import Link from 'next/link';
import { getDateFromUnixSecs, getSecsFromUnixSecs, getBlockAgeFromSecs, getEtherValueFromWei } from '@/lib/utilities';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';


type Props = {
  network: string,
  alchemy: Alchemy
}

export default function BlockPage(props: Props) {
  const searchParams = useSearchParams();
  const number = +searchParams.get('number')!;

  const blockRewardUrl = props.network === 'mainnet' ?
    `https://eth.blockscout.com/api?module=block&action=getblockreward&blockno=${number}`
    :
    `https://api-sepolia.etherscan.io/api?module=block&action=getblockreward` +
    `&blockno=${number}` +
    `&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;

  const [block, setBlock] = useState<Block>();
  const [finalizedBlock, setFinalizedBlock] = useState<Block>();
  const [blockReward, setBlockReward] = useState<Number>();

  useEffect(() => {
    async function getBlockData() {
      while (!block || !finalizedBlock) {
        try {
          const blockData = await props.alchemy.core.getBlock(number);
          setBlock(blockData);
          const finalizedBlockData = await props.alchemy.core.getBlock('finalized');
          setFinalizedBlock(finalizedBlockData);
        } catch (err) {
          console.error('BlockPage getBlock()', err);
        }
      }
      try {
        const response = await fetch(blockRewardUrl);
        const data = await response.json();
        if (data.result.blockReward)
          setBlockReward(getEtherValueFromWei(data.result.blockReward, 4));
      } catch(error) {
        console.error('BlockPage Etherscan getBlockReward', error);
      }
    }

    getBlockData();
  }, [number, block, finalizedBlock, blockRewardUrl, props.alchemy]);

  const blockDate = getDateFromUnixSecs(block!.timestamp);
  const secs = getSecsFromUnixSecs(block!.timestamp);
  const blockAge = getBlockAgeFromSecs(secs);
  const finalized = number <= finalizedBlock!.number;

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
              <span>{block!.hash}</span>
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
                  <span className='bg-red-200 text-red-700 border-red-400
                              dark:bg-red-500 dark:text-red-100 dark:border-red-300
                                border rounded-md p-1 px-4 w-[7.6rem]'>
                    Unfinalized
                  </span>
              }
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Timestamp:</span>
              <span>{blockAge} ago ({blockDate})</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Fee recipient:</span>
              <Link
                href={`/${props.network}/address?hash=${block!.miner}`}
                className='font-mono text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
              >
                {block!.miner}
              </Link>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>

              <span className='w-60'>Block reward:</span>
              <span>Ξ{blockReward!.toString()}</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Gas Used:</span>
              <span>{+Utils.formatEther(block!.gasUsed) * Math.pow(10, 9)} Gwei (Ξ{Utils.formatEther(block!.gasUsed)})</span>
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}
