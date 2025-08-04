import { useState } from 'react';
import type {
  DataStateConstructor,
  FetchConfig,
} from '../types';
import { useDataStateMethods } from '../methods';
import { createLoadingRoot } from './data-root';


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
export const useConfig: DataStateConstructor = <T, A extends any[], R>(config: FetchConfig<T, A, R>) => {
  // Initialize a LoadingRoot as root variant for the DataState:
  // Calling `DataState.loading()` inside `useState()` is required to
  // get a LoadingRoot (DataRoot<undefined>) instead of an `undefined`.
  // This is incorrect usage: `useState<DataState<T>>()`!
  // Also, the input for setDataRoot() needs to be a DataRoot<T>, so correct usage is:
  // `dataState.setDataRoot(createValueRoot(myValue));`
  const [dataRoot, setDataRoot] = useState(createLoadingRoot<T>());

  // Create the DataStateMethods to extend the DataRoot<T> into a full DataState<T>:
  const dataStateMethods = useDataStateMethods(dataRoot, setDataRoot, config);

  return { ...dataRoot, ...dataStateMethods };
};

// End-user hook that creates a DataState<T> object from a FetchConfig
// and directly runs the fetch to populate it with data:
// (useConfig() also creates a DataState, but doesn't actually run the fetch)
export const useDataState: DataStateConstructor = (config) => {
  const dataState = useConfig(config);
  dataState.useInit();

  return dataState;
}
