import { useDataState, FetchError } from '@/lib/data-state';
import { getBlockRewardUrl, getEtherValueFromWei } from '@/lib/utilities';
import ErrorIndicator from '@/components/common/indicators/error-indicator';
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

  return (
    <span className='pl-2 md:pl-4'>
      <blockRewardData.Render
        staticContent='Block Reward:'
        loadingPulseColor='bg-(--grey-fg-color)'
      />
      &nbsp;&nbsp;
      <blockRewardData.Render
        valueCallback={ (data) => `Ξ${getEtherValueFromWei(data.blockReward, 4)}` }
        showErrorFallback={props.id === 0 && blockRewardData.error && blockRewardData.error instanceof FetchError}
        errorFallback={<ValueWithRefetch refetch={blockRewardData.fetch} value='TBD'/>}
        jointClass='w-[4rem] text-(--grey-fg-color)'
      />
    </span>
  );
}