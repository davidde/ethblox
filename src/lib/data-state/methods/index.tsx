import { DataState, FetchConfig } from '../types';
import { getRender } from './get-render';
import { getFetch } from './get-fetch';
import { getLoad } from './get-load';
import { getTransform } from './get-transform';
import { useMemo, useRef, useCallback } from 'react';


export function useMethodSetter<T, A extends any[] = any[]>(
  dataState: DataState<T>,
  config: FetchConfig<T, A>,
) {
  // Stabilize args and default to empty array if no args provided:
  const args = useMemo(() => config.args || [] as unknown as A,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    config.args || [] as unknown as A);

  // Stabilize fetcher: only create it once and don't update it.
  // Even if the parent re-creates the fetcher each render (e.g. when defined
  // inline), this fetcher remains the same as on its first initialization.
  // This means that when it closes over variables that might change,
  // it always KEEPS the FIRST VERSION that it received!
  // Those variables have to be provided as ARGUMENTS!
  const fetcher = useRef(config.fetcher).current;

  const setRoot = dataState.setRoot; // For deps array

  dataState.fetch = useCallback(async () => {
    const fetch = getFetch(fetcher, args);
    const result = await fetch();

    setRoot(result);
    // return result;
  }, [fetcher, args, setRoot]);

  dataState.useLoad = getLoad(dataState);
  dataState.Render = getRender(dataState);
  
  dataState.useTransform = getTransform(dataState);



  // const useCompose = <O,>(otherDataState: DataState<O>): DataState<any> => {
  //   const composedFetcher = async () => await Promise.all([fetch(), otherDataState.fetch()]);

  //   const fetchConfig = {
  //     fetcher: composedFetcher,
  //     args: args,
  //   };

  //   // Construct the new subset DataState to return:
  //   const composedData = useFetch<[T | undefined, O | undefined]>(fetchConfig)
  //     .useTransform(
  //       ( [thisData, otherData] ) => {
  //         if (!thisData || !otherData) return null;
  //         if (thisData && otherData) return [thisData, otherData];
  //       }
  //     );

  //   useEffect(() => {
      
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [dataState]);

  //   return composedData;
  // }
}