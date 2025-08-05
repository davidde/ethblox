import { DataState, FetchConfig } from '../types';
import { getRender } from './get-render';
import { useFetcher } from './use-fetcher';
import { getLoad } from './get-load';
import { getTransform } from './get-transform';


export function useMethodSetter<T, A extends any[] = any[]>(
  dataState: DataState<T>,
  config: FetchConfig<T, A>,
) {
  dataState.fetch = useFetcher(dataState, config);
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