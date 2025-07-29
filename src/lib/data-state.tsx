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
  // dataState.setRoot(DataRoot.value(myValue));
  setRoot: Dispatch<SetStateAction<DataRoot<T>>>;
  // The DataState.Render() method can be called at all times; in Value-, Error-,
  // as well as LoadingState! It will render the apropriate component,
  // either the value, an ErrorIndicator, or a LoadingIndicator.
  // If the DataState's value exists, the Render method will first check if the user
  // provided a value callback function (e.g. to render a subfield of the DataState),
  // and render that, or otherwise default to rendering the DataState's value directly.
  Render: (options?: RenderConfig) => ReactNode;
  // This is the fetch function that is used to initialize the DataState,
  // which can be called to refetch when an error occurred.
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
  // Optionally skip fetching while true. This should be set to true while
  // input for the fetcher is undefined or null, and fetching should
  // be aborted. E.g. when an arg is possibly undefined, `skipFetch = !arg`!
  skipFetch?: boolean;
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
    else { // `String(err)` could technically still fail if someone throws bad objects:
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
    // Calling `DataState.loading()` inside `useState()` is required to
    // get a LoadingRoot (DataRoot<undefined>) instead of an `undefined`.
    // This is incorrect usage: `useState<DataState<T>>()`!
    const [dataRoot, setRoot] = useState(DataState.loading<T>());
    const fetch = useFetcher(config, setRoot);

    const Render = ({
        value,
        error,
        showFallback = true,
        loadingFallback,
        errorFallback,
        fallbackClass,
      }: RenderConfig = {}
    ): ReactNode => {
      if (dataRoot.value) return value ? value() : String(dataRoot.value);
      if (dataRoot.error) {
        // console.log('dataRoot.value = ', dataRoot.value);
        // console.log('dataRoot.error = ', dataRoot.error);
        return showFallback ?
        ( errorFallback ? errorFallback : <ErrorIndicator error={error} className={fallbackClass} /> )
        :
        '';
      }
      else return showFallback ?
        ( loadingFallback ? loadingFallback : <LoadingIndicator className={fallbackClass} /> )
        :
        '';
    }

    return { ...dataRoot, setRoot, Render, fetch };
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
  config: FetchConfig<T, A>,
  setRoot: Dispatch<SetStateAction<DataRoot<T>>>
): () => Promise<any> {
  const args = useArgs(...(config.args || [] as unknown as A));
  // Only create fetcher once and don't update it:
  // Even if the parent re-creates the fetcher each render,
  // this hook will always use the first one.
  // This means that when it closes over variables that might change,
  // it always KEEPS the FIRST VERSION that it received!
  // Those variables have to be provided as ARGUMENTS!
  const stableFetcher = useRef(config.fetcher).current;

  return useCallback(async () => {
    if (config.skipFetch) return;

    let response;

    try {
      response = await stableFetcher(...args);
      // console.log('response = ', response);

      // If the function is fetch, call `.json()`:
      if (response instanceof Response) {
        if (!response.ok) throw new Error(`Fetch response NOT OK, status: ${response.status}`);
        const json = await response.json();
        if ('result' in json) response = json.result;
        else response = json;
      }
      if (!response) throw new Error('Empty response');
      setRoot(DataState.value(response));
    } catch (err) {
      setRoot(DataState.error(err));
    }

    // console.log('response = ', response);
    return response;
  }, [stableFetcher, args, config.skipFetch, setRoot]);
}

// Hook that memoizes the argument array to prevent a new array
// from being created on every render:
// (For inline use in `useDataState()` or `DataState.Init()` calls)
export function useArgs<T extends any[]>(...args: T): T {
  // Prevent infinite loop by NOT refetching unless the arguments actually changed:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => args, args);
}
