import { Alchemy, Utils } from 'alchemy-sdk';
import Link from 'next/link';
import { getDateFromUnixSecs, getSecsFromUnixSecs, getBlockAgeFromSecs, getEtherValueFromWei } from '@/lib/utilities';


type Props = {
  number: number,
  network: string,
  alchemy: Alchemy
}

export default async function BlockPage(props: Props) {
  let block, finalizedBlock, blockReward;
  const blockRewardUrl = props.network === 'mainnet' ?
    `https://eth.blockscout.com/api?module=block&action=getblockreward&blockno=${props.number}`
    :
    `https://api-sepolia.etherscan.io/api?module=block&action=getblockreward` +
    `&blockno=${props.number}` +
    `&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;

  while (!block || !finalizedBlock) {
    try {
      block = await props.alchemy.core.getBlock(props.number);
      finalizedBlock = await props.alchemy.core.getBlock('finalized');
    } catch (err) {
      console.error('BlockPage getBlock()', err);
    }
  }
  try {
    const response = await fetch(blockRewardUrl);
    const data = await response.json();
    blockReward = data.result.blockReward;
  } catch(error) {
    console.error('BlockPage Etherscan getBlockReward', error);
  }

  const blockDate = getDateFromUnixSecs(block.timestamp);
  const secs = getSecsFromUnixSecs(block.timestamp);
  const blockAge = getBlockAgeFromSecs(secs);
  if (blockReward) blockReward = getEtherValueFromWei(blockReward, 4);
  const finalized = props.number <= finalizedBlock.number;

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
              <span>{props.number}</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Block hash:</span>
              <span>{block.hash}</span>
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
                href={`/${props.network}/address/${block.miner}`}
                className='font-mono text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
              >
                {block.miner}
              </Link>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>

              <span className='w-60'>Block reward:</span>
              <span>Ξ{blockReward}</span>
            </p>
          </li>
          <li className='list-disc ml-4 mt-4 m-2'>
            <p className='flex flex-col md:flex-row'>
              <span className='w-60'>Gas Used:</span>
              <span>{+Utils.formatEther(block.gasUsed) * Math.pow(10, 9)} Gwei (Ξ{Utils.formatEther(block.gasUsed)})</span>
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}
