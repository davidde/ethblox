import { useState } from 'react';
import type {
  DataStateConstructor,
  FetchConfig,
} from '../types';
import { useDataStateMethods } from '../methods';
import { useDataRoot } from './data-root';
import { createLoadingRoot } from './root';


/*********************************************************************
Constructors for the DataState type:
* `useConfig()` is the actual DataState constructor that
  uses a FetchConfig object to initialize the DataState.
* `useDataState()` is an end-user hook that calls `useConfig()`,
  and then additionally runs `useInit()` to run the fetch and
  populate the DataState with actual data.
*********************************************************************/


// Create a `DataState<T>` type from a FetchConfig object, and initialize it as a LoadingRoot.
// This function needs to create all DataStateMethods to pass on to the DataState!
// Contrary to `useDataState()`, this constructor does NOT actually run the fetch!
export const useConfig: DataStateConstructor = <T, A extends any[] = any[]>(config: FetchConfig<T, A>) => {
  // Initialize a DataRoot<T> in Loading state:
  // const dataRoot = useDataRoot<T>();
  const [root, setRoot] = useState(createLoadingRoot<T>());

  // Create the DataStateMethods to extend the DataRoot<T> into a full DataState<T>:
  const dataStateMethods = useDataStateMethods<T>(root, setRoot, config);

  return { ...root, ...dataStateMethods };
};

// End-user hook that creates a DataState<T> object from a FetchConfig
// and directly runs the fetch to populate it with data:
// (useConfig() also creates a DataState, but doesn't actually run the fetch)
export const useDataState: DataStateConstructor = (config) => {
  const dataState = useConfig(config);
  dataState.useInit();

  return dataState;
}
