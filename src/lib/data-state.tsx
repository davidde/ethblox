import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorIndicator from '@/components/common/indicators/error-indicator';
import { getAlchemy } from './utilities';
import { useNetwork } from '@/components/common/network-context';
import { Alchemy } from 'alchemy-sdk';


// Options to configure the `DataState`'s Render method that displays
// either the `ValueState`'s value, or the `ErrorState`'s error.
interface RenderOptions {
  // Optional callback function for rendering a subfield of the `ValueState`'s value IFF that value is present:
  value?: () => ReactNode,
  // Optional short error to display instead of full error:
  error?: string,
  // Optionally don't display fallback components like Loading- or ErrorIndicators:
  showFallback?: boolean,
  // Optionally display another component instead of the default LoadingIndicator:
  loadingFallback?: ReactNode,
  // Optionally display another component instead of the default ErrorIndicator:
  errorFallback?: ReactNode,
  // Optional className for the fallback component when it exists:
  fallbackClass?: string,
}

type ValueState<T> = {
  value?: T;
  error: undefined;
  Render: (options?: RenderOptions) => ReactNode;
};
type ErrorState = {
  value: undefined;
  error?: Error;
  Render: (options?: RenderOptions) => ReactNode;
};

// Calling `DataState.value()` inside `useState()` is required
// to get a `DataState<undefined>` instead of an `undefined`!
// `type DataState<T> = ValueState<T> | ErrorState`, so:
// `ValueState<T>.value` either has `value<T>` OR `undefined`,
// the latter indicating it is still in a loading state, OR in ErrorState.
// `ErrorState.error` either has an Error object or undefined.
// The DataState.Render() method can be called at all times;
// in Value- as well as ErrorState!
// It will render the apropriate component,
// either a LoadingIndicator, an ErrorIndicator, or the value.
// If the DataState's value exists, the render method will render
// its value callback function if that is present,
// or default to rendering the DataState's value directly if not.
type DataState<T> = ValueState<T> | ErrorState;

// Factory functions to return the `DataState` type,
// as well as implement the associated Render() function:
const DataState = {
  // Create ValueState<T> from value or nothing when initializing:
  value: <T,>(dataValue?: T): DataState<T> => {
    const Render = ({
      value,
      showFallback = true,
      loadingFallback,
      fallbackClass,
    }: RenderOptions = {}) =>
    {
      if (dataValue) return value ? value() : String(dataValue);
      else return showFallback ?
        ( loadingFallback ? loadingFallback : <LoadingIndicator className={fallbackClass} /> )
        :
        '';
    };

    return {
      value: dataValue,
      error: undefined,
      Render
    };
  },

  // Create ErrorState from `unknown` error, to be used in `catch` block:
  error: (unknownError: unknown, errorPrefix?: string): ErrorState => {
    let errorInstance: Error;

    if (unknownError instanceof Error) {
      if (errorPrefix) unknownError.message = `${errorPrefix} ${unknownError.message}`;
      errorInstance = unknownError as Error;
    }
    else { // `String(err)` could technically still fail if someone throws bad objects:
      errorInstance = errorPrefix ?
        new Error(`${errorPrefix} ${String(unknownError)}`) : new Error(String(unknownError));
    }

    const Render = ({
      error,
      showFallback = true,
      errorFallback,
      fallbackClass,
    }: RenderOptions = {}) =>
    {
      return showFallback ?
        ( errorFallback ? errorFallback : <ErrorIndicator error={error} className={fallbackClass} /> )
        :
        '';
    };

    console.error(errorInstance);
    return {
      value: undefined,
      error: errorInstance,
      Render,
    };
  }
};

// FetchConfig is used to initialize the `useDataState()` hook.
// This hook returns a DataState<T>, together with its fetching function for potentially refetching it.
// * `fetcher`: takes either the `fetch` function directly, or any async function.
// * `args`: optional and takes the arguments for the fetcher.
// * `skipFetch`: also optional and should be set to true if any input for the fetcher
//    is incorrectly undefined or null, and fetching should be aborted.
type FetchConfig<T, A extends any[] = any[]> = {
  fetcher: (...args: A) => Promise<T>;
  args?: A;
  skipFetch?: boolean
};

// Hook that takes a `fetcher` function as input,
// and returns a [dataState, getDataState] value & getter pair:
export function useDataState<T, A extends any[] = any[]>(
  {
    fetcher,
    args = [] as unknown as A,
    skipFetch = false
  }: FetchConfig<T, A>
): [DataState<T>, () => Promise<void>] {
  const [dataState, setDataState] = useState(DataState.value<T>());

  const getDataState = useCallback(async () => {
    if (skipFetch) return;
    try {
      let response = await fetcher(...args);
      // If the function is fetch, call `.json()`:
      if (response instanceof Response) {
        if (!response.ok) throw new Error(`Fetch response NOT OK, status: ${response.status}`);
        const json = await response.json();
        if (!json.result) throw new Error('Result missing from .json() response');
        response = json.result;
      }
      if (!response) throw new Error('Empty response');
      setDataState(DataState.value(response));
    } catch (err) {
      setDataState(DataState.error(err));
    }
  }, [fetcher, args, skipFetch]);

  const prevArgs = useRef('');
  useEffect(() => {
    // Prevent infinite loop by NOT refetching unless the arguments actually changed:
    const newArgs = JSON.stringify(args);
    if (newArgs !== prevArgs.current) {
      prevArgs.current = newArgs;
      getDataState();
    }
  }, [getDataState, args]);

  return [dataState, getDataState];
}

export default DataState;