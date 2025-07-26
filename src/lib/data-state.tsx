import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorIndicator from '@/components/common/indicators/error-indicator';


type ValueStateBase<T> = {
  value?: T;
  error: undefined;
};
type ErrorStateBase = {
  value: undefined;
  error?: Error;
};

// Calling `DataStateBase.value()` inside `useState()` is required
// to get a `DataStateBase<undefined>` instead of an `undefined`!
// `type DataStateBase<T> = ValueStateBase<T> | ErrorStateBase`, so:
// `ValueStateBase<T>.value` either has `value<T>` OR `undefined`,
// the latter indicating it is still in a loading state, OR in ErrorStateBase.
// `ErrorStateBase.error` either has an Error object or undefined.
type DataStateBase<T> = ValueStateBase<T> | ErrorStateBase;

// The DataState.Render() method can be called at all times;
// in Value- as well as ErrorState!
// It will render the apropriate component,
// either a LoadingIndicator, an ErrorIndicator, or the value.
// If the DataState's value exists, the render method will render its value
// callback function (e.g. to get a subfield of the value) if that is present,
// or default to rendering the DataState's value directly if not.
type DataStateMethods = {
  Render: (options?: RenderConfig) => ReactNode;
  refetch: () => Promise<void>; // Revert to non optional later
};

type ValueState<T> = ValueStateBase<T> & DataStateMethods;
type ErrorState = ErrorStateBase & DataStateMethods;
export type DataState<T> = ValueState<T> | ErrorState;

// Factory functions to return the `DataStateBase` type:
const DataStateBase = {
  // Create ValueState<T> from value or nothing when initializing:
  value: <T,>(dataValue?: T): DataStateBase<T> => {
    return {
      value: dataValue,
      error: undefined,
    };
  },

  // Create ErrorState from `unknown` error, to be used in `catch` block:
  error: (unknownError: unknown, errorPrefix?: string): ErrorStateBase => {
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
    };
  }
};

// Options to configure the `DataState`'s Render method that displays
// either the `ValueState`'s value, or the `ErrorState`'s error.
interface RenderConfig {
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
// and returns a DataState object that extends DataStateBase
// with a Render() and refetch() function:
export function useDataState<T, A extends any[] = any[]>(
  {
    fetcher,
    args = [] as unknown as A,
    skipFetch = false
  }: FetchConfig<T, A>
): DataState<T> {
  const [dataStateBase, setDataStateBase] = useState(DataStateBase.value<T>());

  const refetch = useCallback(async () => {
    if (skipFetch) return;
    try {
      let response = await fetcher(...args);
      // If the function is fetch, call `.json()`:
      if (response instanceof Response) {
        if (!response.ok) throw new Error(`Fetch response NOT OK, status: ${response.status}`);
        const json = await response.json();
        if ('result' in json) response = json.result;
        else response = json;
      }
      if (!response) throw new Error('Empty response');
      setDataStateBase(DataStateBase.value(response));
    } catch (err) {
      setDataStateBase(DataStateBase.error(err));
    }
  }, [fetcher, args, skipFetch]);

  const prevArgs = useRef('');
  useEffect(() => {
    // Prevent infinite loop by NOT refetching unless the arguments actually changed:
    const newArgs = JSON.stringify(args);
    if (newArgs !== prevArgs.current) {
      prevArgs.current = newArgs;
      refetch();
    }
  }, [refetch, args]);

  let Render = dataStateBase.error ?
    ( // Render method for ErrorState:
      (
        {
          error,
          showFallback = true,
          errorFallback,
          fallbackClass,
        }: RenderConfig = {}
      ) => {
        return showFallback ?
          ( errorFallback ? errorFallback : <ErrorIndicator error={error} className={fallbackClass} /> )
          :
          '';
      }
    )
    :
    ( // Render method for ValueState:
      (
        {
          value,
          showFallback = true,
          loadingFallback,
          fallbackClass,
        }: RenderConfig = {}
      ) => {
        if (dataStateBase.value) return value ? value() : String(dataStateBase.value);
        else return showFallback ?
          ( loadingFallback ? loadingFallback : <LoadingIndicator className={fallbackClass} /> )
          :
          '';
      }
    );

  return { ...dataStateBase, Render, refetch };
}
