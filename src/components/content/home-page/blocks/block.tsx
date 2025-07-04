import { CubeIcon } from '@heroicons/react/24/outline';
import { Alchemy } from 'alchemy-sdk';
import { getSecsFromUnixSecs, truncateAddress, getEtherValueFromWei } from '@/lib/utilities';
import Link from 'next/link';
import PopoverLink from './popover-link';


type Props = {
  blockNumber: number | undefined,
  network: string,
  alchemy: Alchemy
}

export default async function Block(props: Props) {
  const blockRewardUrl = props.network === 'mainnet' ?
    `https://eth.blockscout.com/api?module=block&action=getblockreward&blockno=${props.blockNumber}`
    :
    `https://api-sepolia.etherscan.io/api?module=block&action=getblockreward` +
    `&blockno=${props.blockNumber}` +
    `&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`;
  let block;
  let secsSinceAdded;
  let blockReward;
  let recipient, recipientShort;

  if (props.blockNumber) {
    try {
      block = await props.alchemy.core.getBlock(props.blockNumber);
    } catch(error) {
      console.error('getBlock()', error);
    }
    try {
      const response = await fetch(blockRewardUrl);
      const data = await response.json();
      console.log('data = ', data); // For some reason some blocks return 'No Record Found' ...
      blockReward = data.result?.blockReward;
    } catch(error) {
      console.error('Etherscan getBlockReward', error);
    }
  }

  if (block) {
    secsSinceAdded = getSecsFromUnixSecs(block.timestamp);
    recipient = block.miner;
    recipientShort = truncateAddress(recipient, 20);
  }
  if (blockReward) blockReward = getEtherValueFromWei(blockReward, 4);

  return (
    <div className='p-2 md:p-3 border-b border-[var(--border-color)] last:border-0'>
      <div className='flex flex-col md:flex-row'>
        <div className='flex'>
          <CubeIcon className='w-10 h-10 md:w-8 md:h-8' />
          <div className='flex md:flex-col ml-2 pt-1 md:pt-0 md:w-32'>
            <span className='px-2 md:px-4 leading-5'>
              <Link
                href={`/${props.network}/block?number=${props.blockNumber}`}
                className='text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
              >
                {props.blockNumber}
              </Link>
            </span>
            <span className='md:pl-4 text-sm text-[var(--grey-fg-color)]'>({secsSinceAdded} secs ago)</span>
          </div>
        </div>
        <div className='flex flex-col ml-12 md:ml-8 mb-2 md:mb-0'>
          <span className='px-2 md:px-4 leading-5'>{block?.transactions.length} transactions</span>
          <span className='pl-2 md:pl-4'>
            Block Reward: { blockReward !== undefined && blockReward !== null ? `Ξ${blockReward}` : 'TBD' }
          </span>
          <span className='pl-2 md:pl-4 leading-5'>
            Recipient:&nbsp;
            <PopoverLink
              href={`/${props.network}/address?hash=${recipient}`}
              content={recipientShort ?? ''}
              popover={recipient ?? ''}
              className='left-[-37%] top-[-2.6rem] w-[19.5rem] py-1.5 px-2.5'
            />
          </span>
        </div>
      </div>
    </div>
  );
}