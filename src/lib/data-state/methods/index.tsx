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
import { getFetch } from './get-fetch';
import { getLoad } from './get-load';
import { getTransform } from './get-transform';


export function useMethodSetter<T, A extends any[] = any[]>(
  dataState: DataState<T>,
  config: FetchConfig<T, A>,
) {
  dataState.fetch = getFetch(dataState, config);
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