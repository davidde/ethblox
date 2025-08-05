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


export function useMethodSetter<T, A extends any[] = any[]>(
  dataState: DataState<T>,
  config: FetchConfig<T, A>,
) {
  dataState.fetch = getFetch(dataState, config);

  // Get an actual value by doing initial fetch in useEffect():
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useLoad = () => useEffect( () => { dataState.fetch() }, [dataState.fetch] );

  const Render = getRender(dataState);

  // Create a new DataState containing a subset of the fields of another:
  const useTransform = <U, B extends any[]>(
    transformer: (data: T, ...args: B) => U,
    transformerArgs?: B,
  ): DataState<U> => {
    // Stabilize the transformer function once - it never changes:
    const stableTransformer = useRef(transformer).current;
    // Stabilize the arguments:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableArgs = useMemo(() => transformerArgs || [] as unknown as B, transformerArgs || [] as unknown as B);

    const transformConfig = {
      transformer: stableTransformer,
      args: stableArgs,
    };

    // Construct the new subset DataState to return:
    const transformedData = useFetch<U, T>(transformConfig);

    useEffect(() => {
      switch (dataState.status) {
        case 'loading':
          break;
        case 'value':
          try {
            const transformedValue = stableTransformer(dataState.value, ...stableArgs);
            transformedData.setValue(transformedValue);
          } catch (err) {
            // Handle transformer errors gracefully:
            transformedData.setError(
              new Error(`DataState useTransform() transformer function failed:
              ${err instanceof Error ? err.message : 'Unknown error'}`,
              { cause: err })
            );
          }
          break;
        case 'error':
          transformedData.setError(dataState.error);
          break;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataState, stableArgs]);

    return transformedData;
  }


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