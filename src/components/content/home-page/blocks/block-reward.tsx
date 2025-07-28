import { useDataState } from '@/lib/data-state';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import LoadingPulseStatic from '@/components/common/indicators/loading-pulse-static';
import ErrorWithRefetch from '@/components/common/indicators/error-with-refetch';
import { getBlockRewardUrl, getEtherValueFromWei } from '@/lib/utilities';


export default function BlockReward(props: {
  id: number,
  network: string,
  blockNumber?: number,
}) {
  // Define args array before `useDataState` call so it's not defined inline.
  // This prevents a new array from being created on every render:
  const BLOCK_REWARD_URL = [getBlockRewardUrl(props.network, props.blockNumber!)];

  const blockRewardData = useDataState<any>({
    fetcher: (url) => fetch(url),
    args: BLOCK_REWARD_URL,
    skipFetch: !props.blockNumber
  });

  let blockReward = '';
  if (blockRewardData.value) blockReward = `Ξ${getEtherValueFromWei(blockRewardData.value.blockReward, 4)}`;

  if (props.id === 0) {
    console.log('blockRewardData.error = ', blockRewardData.error);
    if (blockRewardData.error) console.log('blockRewardData.error.message = ', `"${blockRewardData.error.message}"`);
  }
  // Latest Block often doesn't have reward yet:
  // This doesnt work because the DataState remains in ErrorState, so the blockReward value will never be rendered!
  if (props.id === 0 && blockRewardData.error && blockRewardData.error.message === 'Error: Empty response') {
    blockReward = 'TBD';
  }

  return (
    <span className='pl-2 md:pl-4'>
      <LoadingPulseStatic
        content='Block Reward:'
        dataState={blockRewardData}
        className='bg-(--grey-fg-color)'
      />
      &nbsp;&nbsp;
      <blockRewardData.Render
        value={ () => blockReward }
        loadingFallback={<LoadingPulse className='bg-(--grey-fg-color) w-[4rem]' />}
        errorFallback={<ErrorWithRefetch refetch={blockRewardData.refetch} />}
      />
    </span>
  );
}