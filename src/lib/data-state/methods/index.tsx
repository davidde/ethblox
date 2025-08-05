import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { DataRoot, DataState, FetchConfig, Fetcher, RenderConfig } from '../types';
import ErrorIndicator from '@/components/common/indicators/error-indicator';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import RefetchIndicator from '@/components/common/indicators/refetch-indicator';
import { useFetch } from '../constructors/data-state';
import { fetchJson } from '../helpers';
import { RenderError } from '../types/errors';
import { createLoadingRoot, createValueRoot, createErrorRoot } from '../constructors/root';
import { getRender } from './get-render';


export function useDataStateMethods<T, A extends any[] = any[]>(
  dataState: DataState<T>,
  config: FetchConfig<T, A>,
) {
  // Stabilize args and default to empty array if no args provided:
  const args = useMemo(() => config.args || [] as unknown as A,
  // eslint-disable-next-line react-hooks/exhaustive-deps
    config.args || [] as unknown as A);

  // Stabilize fetcher/postProcess: only create them once and don't update them.
  // Even if the parent re-creates the fetcher each render (e.g. when defined
  // inline), this fetcher remains the same as on its first initialization.
  // This means that when it closes over variables that might change,
  // it always KEEPS the FIRST VERSION that it received!
  // Those variables have to be provided as ARGUMENTS!
  const fetcher = useRef(config.fetcher).current;

  // Attach setRoot to fetcher so fetching can update the DataState:
  const fetch = useCallback(async () => {
    // Skip fetching if one of the arguments is still undefined:
    if (args?.some(arg => arg === undefined)) return createLoadingRoot<T>();

    let result;
    try {
      let response: T;
      if (fetcher) response = await fetcher(...args);
      else response = await fetchJson(args[0] as string);

      result = createValueRoot(response);
    } catch (err) {
      result = createErrorRoot<T>(err);
    }
    dataState.setRoot(result);
    return result;
  }, [fetcher, args, dataState.setRoot]);

  dataState.fetch = fetch;

  // Get an actual value by doing initial fetch in useEffect():
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useLoad = () => useEffect( () => { fetch() }, [fetch] );

  const Render = getRender(dataState);

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

  return { useLoad, Render,  }; // useTransform, useCompose };
}