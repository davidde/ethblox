import { useDataState } from '@/lib/data-state';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import LoadingPulseStatic from '@/components/common/indicators/loading-pulse-static';
import ErrorWithRetry from '@/components/common/indicators/error-with-retry';
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
  // Latest Block often doesn't have reward yet:
  if (props.id === 0 && blockRewardData.error && blockRewardData.error.message === 'Result missing from .json() response') {
    blockReward = 'TBD';
  }

  // ErrorState is broken due to the change that now returns a DataState instead of an ErrorState!
  // We get a ValueState with an Error, so it just displays LoadingIndicators for all Errors!!!
  console.log(blockRewardData.value); // LoadingPulse when `Error: Empty response` for block rewards!

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
        errorFallback={<ErrorWithRetry refetch={blockRewardData.refetch} />}
      />
    </span>
  );
}