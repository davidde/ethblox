import { useDataState, FetchError } from '@/lib/data-state';
import { getBlockRewardUrl, getEtherValueFromWei } from '@/lib/utilities';
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
        // Latest Block often doesn't have a reward yet, so don't show explicit red error:
        showErrorSubstitute={props.id === 0 && Boolean(blockRewardData.error) && blockRewardData.error instanceof FetchError}
        className='w-[4rem] text-(--grey-fg-color)'
      >
        { (data) => `Ξ${getEtherValueFromWei(data.blockReward, 4)}` }
      </blockRewardData.Render>
    </span>
  );
}