import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorIndicator from '@/components/common/indicators/error-indicator';


type ValueRoot<T> = {
  value: T;
  error: undefined;
  loading: false;
};
type ErrorRoot = {
  value: undefined;
  error: Error;
  loading: false;
};
type LoadingRoot = {
  value: undefined;
  error: undefined;
  loading: true;
};

export type DataRoot<T> = ValueRoot<T> | ErrorRoot | LoadingRoot;
export type DataState<T> = DataRoot<T> & DataStateMethods<T>;

// Methods that extend the DataRoot<T> into a full DataState<T> type:
interface DataStateMethods<T> {
  // This sets the DataRoot value using React's useState.
  // CAREFUL: `setRoot` requires using `useEffect`, `useCallback` or event handlers!
  // Do NOT use it directly in a component's body or this will cause an infinite rerender loop!
  // The input needs to be a DataRoot<T>, so usage is:
  // dataState.setRoot(DataState.value(myValue));
  setRoot: Dispatch<SetStateAction<DataRoot<T>>>;
  // The setLoading(), setValue() and setError() methods are convenience wrappers
  // for the above setRoot(), and allow directly passing a value or error instead
  // of `setRoot(DataState.value(value))` or `setRoot(DataState.error(error))`:
  setLoading: () => void;
  setValue: (value: T) => void;
  setError: (error: unknown, prefix?: string) => void;
  // The DataState.Render() method can be called at all times; in Value-, Error-,
  // as well as LoadingState! It will render the apropriate component,
  // either the value, an ErrorIndicator, or a LoadingIndicator.
  // If the DataState's value exists, the Render method will first check if the user
  // provided a value callback function (e.g. to render a subfield of the DataState),
  // and render that, or otherwise default to rendering the DataState's value directly.
  Render: (options?: RenderConfig) => ReactNode;
  // This is the fetch function that is used to initialize the DataState,
  // and can be called to refetch when an error occurred.
  fetch: () => Promise<any>;
};

// Options to configure the `DataState`'s Render method that displays
// either the `ValueState`'s value, or the `ErrorState`'s error.
interface RenderConfig {
  // Optional callback function for rendering a subfield of the `ValueState`'s value IFF that value is present:
  value?: () => ReactNode;
  // Optional short error to display instead of full error:
  error?: string;
  // Optionally don't display fallback components like Loading- or ErrorIndicators:
  showFallback?: boolean;
  // Optionally display another component instead of the default LoadingIndicator:
  loadingFallback?: ReactNode;
  // Optionally display another component instead of the default ErrorIndicator:
  errorFallback?: ReactNode;
  // Optional className for the fallback component when it exists:
  fallbackClass?: string;
}

// FetchConfig is used to initialize a DataState<T>, which is a DataRoot<T>,
// together with its fetching function for potentially refetching it:
interface FetchConfig<T, A extends any[] = any[]> {
  // `fetcher` takes either the `fetch` function directly, or any async function:
  fetcher: (...args: A) => Promise<T>;
  // Optionally provide arguments for the fetcher:
  args?: A;
};

// Factory functions for DataState type.
// DataState.loading(), .value() and .error() return *DataRoots*,
// to be used for initializing or setting a full DataState:
export const DataState = {
  // Create LoadingRoot from nothing for initializing empty DataState:
  // This needs to return a DataRoot, and NOT a LoadingRoot,
  // so we can later assign Value- and ErrorRoots too if required!
  loading: <T,>(): DataRoot<T> => ({
      value: undefined,
      error: undefined,
      loading: true,
    }),

  // Create ValueRoot<T> from dataValue:
  value: <T,>(dataValue: T): DataRoot<T> => ({
      value: dataValue,
      error: undefined,
      loading: false,
    }),

  // Create ErrorRoot from `unknown` error, to be used in `catch` block:
  error: <T,>(unknownError: unknown, errorPrefix?: string): DataRoot<T> => {
    let errorInstance: Error;

    if (unknownError instanceof Error) {
      if (errorPrefix) unknownError.message = `${errorPrefix} ${unknownError.message}`;
      errorInstance = unknownError as Error;
    }
    else { // `String(unknownError)` could technically still fail if someone throws bad objects:
      errorInstance = errorPrefix ?
        new Error(`${errorPrefix} ${String(unknownError)}`) : new Error(String(unknownError));
    }

    console.error(errorInstance);

    return {
      value: undefined,
      error: errorInstance,
      loading: false,
    };
  },

  // Factory function to create a `DataState<T>` type from a data fetcher,
  // initializing it as a LoadingRoot:
  Init: <T, A extends any[] = any[]>(config: FetchConfig<T, A>): DataState<T> => {
    // Stabilize args, and default to empty array if no args provided:
    const args = useArgs(...(config.args || [] as unknown as A));
    // Stabilize fetcher: only create it once and don't update it.
    // Even if the parent re-creates the fetcher each render,
    // this fetcher remains the same as on its first initialization.
    // This means that when it closes over variables that might change,
    // it always KEEPS the FIRST VERSION that it received!
    // Those variables have to be provided as ARGUMENTS!
    const fetcher = useRef(config.fetcher).current;
    // Initialize a LoadingRoot as root variant for the DataState:
    // Calling `DataState.loading()` inside `useState()` is required to
    // get a LoadingRoot (DataRoot<undefined>) instead of an `undefined`.
    // This is incorrect usage: `useState<DataState<T>>()`!
    const [dataRoot, setRoot] = useState(DataState.loading<T>());
    // Attach setRoot to fetcher so fetching can update the DataState:
    const fetch = useFetcher(fetcher, args, setRoot);

    const Render = (conf: RenderConfig = {}): ReactNode => {
      const { value, error, showFallback = true, loadingFallback, errorFallback, fallbackClass } = conf;

      if (dataRoot.value) return value ? value() : String(dataRoot.value);
      else if (dataRoot.error) {
        if (showFallback) {
          return errorFallback ?
            errorFallback : <ErrorIndicator error={error} className={fallbackClass} />;
        }
      }
      else if (showFallback) {
        return loadingFallback ?
          loadingFallback : <LoadingIndicator className={fallbackClass} />;
      }
    }
    const setLoading = () => setRoot(DataState.loading());
    const setValue = (dataValue: T) => setRoot(DataState.value(dataValue));
    const setError = (error: unknown, prefix?: string) => setRoot(DataState.error(error, prefix));

    return { ...dataRoot, setRoot, setLoading, setValue, setError, Render, fetch };
  }
};

// End-user hook that takes a `fetcher` function as input,
// and returns a DataState object that extends DataRoot
// with a setState(), Render() and fetch() function:
export function useDataState<T, A extends any[] = any[]>(
  config: FetchConfig<T, A>
): DataState<T> {
  const dataState = DataState.Init(config);

  // Get an actual value by doing initial fetch:
  useEffect(() => {
    dataState.fetch();
    // Only rerun when fetch() changes:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState.fetch]);

  return dataState;
}

// This helper function takes the fetcher provided to the DataState,
// and attaches it to the DataState's internal DataRoot value that is
// tracked and updated with `useState`:
function useFetcher<T, A extends any[] = any[]>(
  fetcher: (...args: A) => Promise<T> | Response,
  args: A,
  setRoot: Dispatch<SetStateAction<DataRoot<T>>>,
): () => Promise<T | undefined> {
  return useCallback(async () => {
    // console.log('Fetch triggered with args: ', args);
    // Skip fetching if one of the arguments is still undefined:
    if (args?.some(arg => arg === undefined)) return;

    try {
      let response = await fetcher(...args);
      if (!response) throw new Error('Empty response');

      const typedResponse = response as T;
      setRoot(DataState.value(typedResponse));
      return typedResponse;
    } catch (err) {
      setRoot(DataState.error(err));
    }
  }, [fetcher, args, setRoot]);
}

// To be used as a wrapper for fetch() inside useDataState inline fetcher definition:
// (This allows the types to match with the DataState's, instead of returning a fetch Response type)
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed, status: ${response.status}`);
  const json = await response.json();
  const result = 'result' in json ? json.result : json;
  if (!result) throw new Error('Empty json response');

  return result as T;
}

// Hook that memoizes the argument array to prevent a new array
// from being created on every render:
// (For inline use in `useDataState()` or `DataState.Init()` calls)
export function useArgs<A extends any[]>(...args: A): A {
  // Prevent infinite loop by NOT refetching unless the arguments actually changed:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => args, args);
}
