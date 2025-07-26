import { useState, useEffect, useCallback } from 'react';
import DataState from '@/lib/data-state';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import LoadingPulseStatic from '@/components/common/indicators/loading-pulse-static';
import ErrorWithRetry from '@/components/common/indicators/error-with-retry';
import { getBlockRewardUrl, getEtherValueFromWei } from '@/lib/utilities';


export default function BlockReward(props: {
  id: number,
  network: string,
  blockNumber?: number,
}) {
  const [blockReward, setBlockReward] = useState(DataState.value<string>());

  const getBlockReward = useCallback(async () => {
    if (props.blockNumber) try {
      const resp = await fetch(getBlockRewardUrl(props.network, props.blockNumber));
      if (!resp.ok) throw new Error(`Response NOT OK, status: ${resp.status}`);
      const data = await resp.json();
      if (!data.result || !data.result.blockReward) {
        // Latest Block often doesn't have reward yet:
        if (props.id === 0) setBlockReward(DataState.value('TBD'));
        else throw new Error('Block reward missing from response.');
      }
      else setBlockReward(DataState.value(`Ξ${getEtherValueFromWei(data.result.blockReward, 4)}`));
    } catch(err) {
      setBlockReward(DataState.error(err));
    }
  }, [props.network, props.blockNumber, props.id]);

  useEffect(() => {
    getBlockReward();
  }, [getBlockReward]);

  return (
    <span className='pl-2 md:pl-4'>
      <LoadingPulseStatic
        content='Block Reward:'
        dataState={blockReward}
        className='bg-(--grey-fg-color)'
      />
      &nbsp;&nbsp;
      <blockReward.Render
        loadingFallback={<LoadingPulse className='bg-(--grey-fg-color) w-[4rem]' />}
        errorFallback={<ErrorWithRetry refetch={getBlockReward} />}
      />
    </span>
  );
}