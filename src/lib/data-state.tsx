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
  // This is the fetch function that is used to initialize the DataState,
  // and can be called to refetch when an error occurred.
  fetch: () => Promise<void>;
  // Populate the DataRoot with data from an initial fetch in useEffect():
  useInit: () => void;
  // The DataState.Render() method can be called at all times; in Value-, Error-,
  // as well as LoadingState! It will render the apropriate component,
  // either the value, an ErrorIndicator, or a LoadingIndicator.
  // If the DataState's value exists, the Render method will first check if the user
  // provided a value callback function (e.g. to render a subfield of the DataState),
  // and render that, or otherwise default to rendering the DataState's value directly.
  Render: (options?: RenderConfig) => ReactNode;
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
interface FetchConfig<T, A extends readonly unknown[] = readonly []> {
  // `fetcher` takes any async function, and can be omitted
  // if the fetcher is the standard Fetch API:
  fetcher?: (...args: A) => Promise<T>;
  // Optionally provide arguments for the fetcher:
  args?: A;
};

// Factory functions for DataState type.
// DataState.loading(), .value() and .error() return *DataRoots*,
// to be used for initializing or setting a full DataState:
export const DataState = {
  // Create LoadingRoot from nothing for initializing empty DataState:
  // This needs to return as DataRoot<T>, and NOT as LoadingRoot,
  // so we can later assign Value- and ErrorRoots too if required!
  loading: <T,>(): DataRoot<T> => ({
      value: undefined,
      error: undefined,
      loading: true,
    }),

  // Create ValueRoot<T> from dataValue and return as DataRoot<T>:
  value: <T,>(dataValue: T): DataRoot<T> => ({
      value: dataValue,
      error: undefined,
      loading: false,
    }),

  // Create ErrorRoot from `unknown` error, to be used in `catch` block:
  // (And return as DataRoot<T>)
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
  useConfig: <T, A extends readonly unknown[] = readonly []>(config: FetchConfig<T, A>): DataState<T> => {
    // Initialize a LoadingRoot as root variant for the DataState:
    // Calling `DataState.loading()` inside `useState()` is required to
    // get a LoadingRoot (DataRoot<undefined>) instead of an `undefined`.
    // This is incorrect usage: `useState<DataState<T>>()`!
    const [dataRoot, setRoot] = useState(DataState.loading<T>());
    const setLoading = () => setRoot(DataState.loading());
    const setValue = (dataValue: T) => setRoot(DataState.value(dataValue));
    const setError = (error: unknown, prefix?: string) => setRoot(DataState.error(error, prefix));

    // Default to empty array if no args provided:
    let args = config.args || [] as unknown as A;
    // Stabilize args:
    args = useMemo(() => args, args);

    // Stabilize fetcher: only create it once and don't update it.
    // Even if the parent re-creates the fetcher each render (e.g. when defined
    // inline), this fetcher remains the same as on its first initialization.
    // This means that when it closes over variables that might change,
    // it always KEEPS the FIRST VERSION that it received!
    // Those variables have to be provided as ARGUMENTS!
    const fetcher = useRef(config.fetcher || fetchJson).current;

    // Attach setRoot to fetcher so fetching can update the DataState:
    const fetch = useCallback(async () => {
      try {
        // Skip fetching if one of the arguments is still undefined:
        if (args?.some(arg => arg === undefined)) return;
        const response = await fetcher(...args);
        setValue(response as T);
      } catch (err) {
        setError(err);
      }
    }, [fetcher, args]);

    // Get an actual value by doing initial fetch in useEffect():
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const useInit = () => useEffect(() => { fetch() }, [fetch]);

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

    return { ...dataRoot, setRoot, setLoading, setValue, setError, fetch, useInit, Render };
  }
};

// Hook that memoizes the argument array to prevent a new array
// from being created on every render:
// (For inline use in `useDataState()` or `DataState.Init()` calls)
export function useArgs<A extends any[]>(...args: A): A {
  // Prevent infinite loop by NOT refetching unless the arguments actually changed:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => args, args);
}

// To be used as a wrapper for fetch() inside useDataState inline fetcher definition:
// (This allows the types to match with the DataState's, instead of returning a fetch Response type)
export async function fetchJson<T>(...args: any[]): Promise<T> {
  const response = await fetch(args[0]);
  if (!response.ok) throw new Error(`Fetch failed, status: ${response.status}`);

  const json = await response.json();
  const result = 'result' in json ? json.result : json;
  if (!result) throw new FetchError(`Empty json response or result, json: ${JSON.stringify(json)}`);

  return result as T;
}

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchWithoutJsonError';
  }
}

// End-user hook that takes a FetchConfig as input and returns a
// DataState<T> object that extends DataRoot<T> with DataStateMethods<T>:
export function useDataState<T, A extends any[] = any[]>(
  config: FetchConfig<T, A>
): DataState<T> {
  const dataState = DataState.useConfig(config);
  dataState.useInit();

  return dataState;
}
