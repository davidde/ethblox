import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorWithRefetch from '@/components/common/indicators/error-with-refetch';


type LoadingRoot = {
  status: 'loading';
  value: undefined;
  error: undefined;
  loading: true;
};
type ValueRoot<T> = {
  status: 'value';
  value: T;
  error: undefined;
  loading: false;
};
type ErrorRoot = {
  status: 'error';
  value: undefined;
  error: Error;
  loading: false;
};

export type DataRoot<T> = LoadingRoot | ValueRoot<T> | ErrorRoot;
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
  Render: <K extends keyof T>(options?: RenderConfig<T, K>) => ReactNode;
  // Get a subfield of the value of the DataState (if it is present):
  getField: <K extends keyof T>(key: K) => T[K] | undefined;
  // subset: <X>() => DataState<X>;
  // compose: <X, Y>(dataState: DataState<X>) => DataState<Y>;
};

// Options to configure the `DataState`'s Render method that displays
// either the `ValueState`'s value, or the `ErrorState`'s error.
interface RenderConfig<T, K extends keyof T> {
  // Optionally render a specific key/field of the DataState's value (IFF it is present):
  field?: K;
  // Optional callback function for transforming the DataState's value before rendering it:
  // (Can optionally use the className provided to the render function, see below)
  valueCallback?: (className?: string) => ReactNode;
  // Optional error message to display instead of 'Error':
  error?: string;
  // Optional message to display while loading:
  loading?: string;
  // Optionally don't display fallback components like Loading- or ErrorIndicators:
  showFallback?: boolean;
  // Optionally display another component instead of the default LoadingIndicator:
  loadingFallback?: ReactNode;
  // Optionally display another component instead of the default ErrorIndicator:
  errorFallback?: ReactNode;
  // Optional className for the displayed component:
  className?: string;
}

// FetchConfig is used to initialize a DataState<T>, which is a DataRoot<T>,
// together with its fetching function for potentially refetching it:
interface FetchConfig<T, A extends any[] = any[], R = T> {
  // `fetcher` takes any async function, and can be omitted
  // if the fetcher is the standard Fetch API:
  fetcher?: (...args: A) => Promise<R>;
  // Optionally provide arguments for the fetcher:
  args?: A;
  // Optional postprocessing function to transform fetched data
  // before returning to DataState<T>:
  postProcess?: (response: R) => T;
};

type DataStateConstructor = <T, A extends any[] = any[], R = T>(
  config: FetchConfig<T, A, R>
) => DataState<T>;

// Factory functions for DataState type.
// DataState.loading(), .value() and .error() return *DataRoots*,
// to be used for initializing or setting a full DataState:
export const DataState: {
  loading: <T,>() => DataRoot<T>;
  value: <T,>(dataValue: T) => DataRoot<T>;
  error: <T,>(unknownError: unknown, errorPrefix?: string) => DataRoot<T>;
  useConfig: DataStateConstructor;
} = {
  // Create LoadingRoot from nothing for initializing empty DataState:
  // This needs to return as DataRoot<T>, and NOT as LoadingRoot,
  // so we can later assign Value- and ErrorRoots too if required!
  loading: () => ({
      status: 'loading',
      value: undefined,
      error: undefined,
      loading: true,
    }),

  // Create ValueRoot<T> from dataValue and return as DataRoot<T>:
  value: (dataValue) => ({
      status: 'value',
      value: dataValue,
      error: undefined,
      loading: false,
    }),

  // Create ErrorRoot from `unknown` error, to be used in `catch` block:
  // (And return as DataRoot<T>)
  error: (unknownError, errorPrefix?) => {
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
      status: 'error',
      value: undefined,
      error: errorInstance,
      loading: false,
    };
  },

  // Factory function to create a `DataState<T>` type from a data fetcher,
  // initializing it as a LoadingRoot:
  useConfig: <T, A extends any[], R>(config: FetchConfig<T, A, R>) => {
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
    const fetcher = useRef(config.fetcher).current;

    // Attach setRoot to fetcher so fetching can update the DataState:
    const fetch = useCallback(async () => {
      try {
        // Skip fetching if one of the arguments is still undefined:
        if (args?.some(arg => arg === undefined)) return;

        let response: R;
        if (fetcher) response = await fetcher(...args);
        else response = await fetchJson(args[0] as string);

        const result = config.postProcess ? config.postProcess(response) : response;

        setValue(result as T);
      } catch (err) {
        setError(err);
      }
    }, [fetcher, args]);

    // Get an actual value by doing initial fetch in useEffect():
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const useInit = () => useEffect(() => { fetch() }, [fetch]);

    const getField = <K extends keyof T>(key: K) => {
      return dataRoot.value?.[key];
    }

    const Render = <K extends keyof T>(conf: RenderConfig<T, K> = {}): ReactNode => {
      const { field, valueCallback, error, loading, showFallback = true, loadingFallback, errorFallback, className } = conf;

      switch (dataRoot.status) {
        case 'loading':
          if (showFallback) {
            if (loadingFallback) return loadingFallback;
            else if (loading) return <LoadingIndicator message={loading} className={className} />;
            else return <LoadingPulse className={className} />;
          } return;
        case 'value':
          if (valueCallback) return valueCallback(className);
          else return field ?
            <span className={className}>{ String(dataRoot.value[field]) }</span>
            :
            <span className={className}>{ String(dataRoot.value) }</span>;
        case 'error':
          if (showFallback) {
            return errorFallback ?? <ErrorWithRefetch refetch={fetch} error={error} className={className} />;
          } return;
      }
    }

    return { ...dataRoot, setRoot, setLoading, setValue, setError, fetch, useInit, getField, Render };
  }
};

// To be used as a wrapper for fetch() inside useDataState inline fetcher definition:
// (This allows the types to match with the DataState's, instead of returning a fetch Response type)
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed, status: ${response.status}`);

  const json = await response.json();
  const result = 'result' in json ? json.result : json;
  if (!result) throw new FetchError(`Empty json response or result.
            json: ${JSON.stringify(json)}
            URL: ${url}`);

  return result as T;
}

export class FetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FetchError';
  }
}

// End-user hook that takes a FetchConfig as input and returns a
// DataState<T> object that extends DataRoot<T> with DataStateMethods<T>:
export const useDataState: DataStateConstructor = (config) => {
  const dataState = DataState.useConfig(config);
  dataState.useInit();

  return dataState;
}
