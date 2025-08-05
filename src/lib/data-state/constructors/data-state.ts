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

// Create a `DataState<T>` type from a FetchConfig object, and initialize it as a LoadingRoot.
// This function needs to create all DataStateMethods to pass on to the DataState!
// Contrary to `useDataState()`, this constructor does NOT actually run the fetch!
export const useFetch: DataStateConstructor = <T, A extends any[] = any[]>(config: FetchConfig<T, A>) => {
  // Initialize a DataRoot<T> in Loading state:
  const dataState = useDummy<T>();

  // Create the DataStateMethods to extend the DataRoot<T> into a full DataState<T>:
  const dataStateMethods = useMethodSetter(dataState, config);

  return { ...dataState, ...dataStateMethods };
};

// End-user hook that creates a DataState<T> object from a FetchConfig
// and directly runs the fetch to populate it with data:
// (useFetch() also creates a DataState, but doesn't actually run the fetch)
export const useDataState: DataStateConstructor = (config) => {
  const dataState = useFetch(config);
  dataState.useLoad();

  return dataState;
}
