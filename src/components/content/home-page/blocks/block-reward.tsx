import { useDataState, FetchError } from '@/lib/data-state';
import { getBlockRewardUrl, getEtherValueFromWei } from '@/lib/utilities';
import LoadingPulseStatic from '@/components/common/indicators/loading-pulse-static';
import ErrorWithRefetch from '@/components/common/indicators/error-with-refetch';
import ValueWithRefetch from '@/components/common/indicators/value-with-refetch';
import { BigNumber } from 'alchemy-sdk';


type BlockRewardData = {
  blockReward: BigNumber,
};

export default function BlockReward(props: {
  id: number,
  network: string,
  blockNumber?: number,
}) {
  const blockRewardData = useDataState<BlockRewardData>({
    args: [getBlockRewardUrl(props.network, props.blockNumber)],
  });

  let errorFallback = <ErrorWithRefetch refetch={blockRewardData.fetch} />;
  // Latest Block often doesn't have a reward yet:
  if (props.id === 0 && blockRewardData.error && blockRewardData.error instanceof FetchError) {
    errorFallback = <ValueWithRefetch refetch={blockRewardData.fetch} value='TBD'/>;
  }

  return (
    <span className='pl-2 md:pl-4'>
      <LoadingPulseStatic
        content='Block Reward:'
        dataState={blockRewardData}
        className='text-(--grey-fg-color)'
      />
      &nbsp;&nbsp;
      <blockRewardData.Render
        valueCallback={ (data) => `Ξ${getEtherValueFromWei(data.blockReward, 4)}` }
        errorFallback={errorFallback}
        jointClass='w-[4rem] text-(--grey-fg-color)'
      />
    </span>
  );
}