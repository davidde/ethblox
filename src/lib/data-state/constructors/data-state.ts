import type {
  DataStateConstructor,
  FetchConfig,
} from '../types';
import { useDummy } from './dummy';


/******************************************************************************
Constructor for the DataState type:
`useDataState()` is an end-user hook that calls `useDummy()` to initialize
a dummy DataState, then sets its fetcher using the `useFetch()` hook, and then
runs `useLoad()` to run the fetch and populate the DataState with actual data.
*******************************************************************************/


// End-user hook that creates a DataState<T> object from a FetchConfig
// and directly runs the fetch to populate it with data:
// (useFetch() also creates a DataState, but doesn't actually run the fetch)
export const useDataState: DataStateConstructor = <T, A extends any[]>(config: FetchConfig<T, A>) => {
  const dataState = useDummy().useFetch<T>(config).useLoad();

  return dataState;
}
