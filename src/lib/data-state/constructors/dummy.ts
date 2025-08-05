import { useMethodSetter } from '../methods';
import { Root, DummyConstructor, Transformer, FetchConfig, DataState, DataRoot } from '../types';
import { useDataRoot } from './data-root';
import { createLoadingRoot } from './root';


// Initialize a `DataState<T>` type in LoadingState with empty shell methods:
export const useDummy: DummyConstructor = <T>() => {
  // Initialize a DataRoot<T> in Loading state:
  const dummy = useDataRoot<T>();

  // Create dummy no-op DataStateMethods:
  const dummyMethods = getDummyMethods<T>();

  // Return the DataRoot<T> with its dummy DataStateMethods as a DataState<T>:
  return { ...dummy, ...dummyMethods };
};

function getDummyMethods<T>() {
  return {
    // No-op methods for initialization:
    fetch: async (): Promise<Root<T>> => createLoadingRoot<T>(),
    useLoad: () => useDummy<T>(),
    Render: () => null,
    useTransform: <U>() => useDummy<U>(),

    // `useFetch()` DOES actually need to work so a working DataState can be initialized with it.
    // This function creates a functional `DataState<T>` type from a FetchConfig object,
    // has a working `fetch()` function, but is still initialized as LoadingRoot.
    // Contrary to `useDataState()`, this constructor does NOT actually run the fetch!
    useFetch: <T, A extends any[]>(config: FetchConfig<T, A>) => {
      // Initialize a dummy DataState<T>:
      const dataState = useDummy<T>();

      // Set all REAL DataStateMethods on it:
      useMethodSetter(dataState, config);

      return dataState;
    },
  }
}
