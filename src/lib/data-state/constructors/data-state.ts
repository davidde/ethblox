import { useState } from 'react';
import type {
  DataStateConstructor,
  DummyConstructor,
  FetchConfig,
} from '../types';
import { useMethodSetter } from '../methods';
import { useDataRoot } from './data-root';
import { useDummy } from './dummy';


/*********************************************************************
Constructors for the DataState type:
* `useFetch()` is the actual DataState constructor that
  uses a FetchConfig object to initialize the DataState.
* `useDataState()` is an end-user hook that calls `useFetch()`,
  and then additionally runs `useLoad()` to run the fetch and
  populate the DataState with actual data.
*********************************************************************/


// End-user hook that creates a DataState<T> object from a FetchConfig
// and directly runs the fetch to populate it with data:
// (useFetch() also creates a DataState, but doesn't actually run the fetch)
export const useDataState: DataStateConstructor = <T, A extends any[]>(config: FetchConfig<T, A>) => {
  const dataState = useDummy().useFetch<T>(config).useLoad();

  return dataState;
}
