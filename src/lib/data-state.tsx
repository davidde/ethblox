import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorIndicator from '@/components/common/indicators/error-indicator';


type ValueStateBase<T> = {
  value: T;
  error: undefined;
  loading: false;
};
type ErrorStateBase = {
  value: undefined;
  error: Error;
  loading: false;
};
type LoadingStateBase = {
  value: undefined;
  error: undefined;
  loading: true;
};

// Calling `DataStateBase.value()` inside `useState()` is required
// to get a `DataStateBase<undefined>` instead of an `undefined`!
// `type DataStateBase<T> = ValueStateBase<T> | ErrorStateBase`, so:
// `ValueStateBase<T>.value` either has `value<T>` OR `undefined`,
// the latter indicating it is still in a loading state, OR in ErrorStateBase.
// `ErrorStateBase.error` either has an Error object or undefined.
export type DataStateBase<T> = ValueStateBase<T> | ErrorStateBase | LoadingStateBase;

// Factory functions to return the `DataStateBase` type:
export const DataStateBase = {
  // Create ValueStateBase<T> from value or nothing when initializing:
  // This needs to return a DataStateBase, and NOT a ValueStateBase,
  // so we can later assign an ErrorState too if required!
  Value: <T,>(dataValue?: T): DataStateBase<T> => {
    if (!dataValue) {
      const loadingState: LoadingStateBase = {
        value: undefined,
        error: undefined,
        loading: true,
      };
      return loadingState;
    }
    else {
      const valueState: ValueStateBase<T> = {
        value: dataValue,
        error: undefined,
        loading: false,
      };
      return valueState;
    }
  },

  // Create ErrorStateBase from `unknown` error, to be used in `catch` block:
  Error: <T,>(unknownError: unknown, errorPrefix?: string): DataStateBase<T> => {
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
    const error: ErrorStateBase = {
      value: undefined,
      error: errorInstance,
      loading: false,
    };
    return error;
  }
};

// Methods that extend the DataStateBase<T> into a full DataState<T> type:
interface DataStateMethods<T> {
  // This sets the DataStateBase value using React's useState.
  // CAREFUL: `setDataStateBase` requires using `useEffect`, `useCallback` or event handlers!
  // Do NOT use it directly in a component's body or this will cause an infinite rerender loop!
  setDataStateBase: Dispatch<SetStateAction<DataStateBase<T>>>,
  // The DataState.Render() method can be called at all times; in Value-, Error-,
  // as well as LoadingState! It will render the apropriate component,
  // either the value, an ErrorIndicator, or a LoadingIndicator.
  // If the DataState's value exists, the Render method will first check if the user
  // provided a value callback function (e.g. to render a subfield of the DataState),
  // and render that, or otherwise default to rendering the DataState's value directly.
  Render: (options?: RenderConfig) => ReactNode;
  // This is the fetch function that is used to initialize the DataState,
  // which can be called to refetch when an error occurred.
  refetch: () => Promise<any>;
};

type ValueState<T> = ValueStateBase<T> & DataStateMethods<T>;
type ErrorState<T> = ErrorStateBase & DataStateMethods<T>;
type LoadingState<T> = LoadingStateBase & DataStateMethods<T>;
export type DataState<T> = ValueState<T> | ErrorState<T> | LoadingState<T>;

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

// FetchConfig is used to initialize a DataState<T>, which is a DataStateBase<T>,
// together with its fetching function for potentially refetching it:
// * `fetcher`: takes either the `fetch` function directly, or any async function.
// * `args`: optional and takes the arguments for the fetcher.
// * `skipFetch`: also optional and should be set to true if any input for the fetcher
//    is incorrectly undefined or null, and fetching should be aborted.
interface FetchConfig<T, A extends any[] = any[]> {
  fetcher: (...args: A) => Promise<T>;
  args?: A;
  skipFetch?: boolean
};

export const DataState = {
  // Factory function to create a `DataState<T>` type,
  // initializing it as a LoadingState:
  Init: <T, A extends any[] = any[]>({
      fetcher,
      args = [] as unknown as A,
      skipFetch = false
    }: FetchConfig<T, A>
  ): DataState<T> => {
    const [dataStateBase, setDataStateBase] = useState(DataStateBase.Value<T>());
    const refetch = useFetcher({ fetcher, args, skipFetch }, setDataStateBase);

    const Render = ({
        value,
        error,
        showFallback = true,
        loadingFallback,
        errorFallback,
        fallbackClass,
      }: RenderConfig = {}
    ): ReactNode => {
      if (dataStateBase.value) return value ? value() : String(dataStateBase.value);
      if (dataStateBase.error) {
        // console.log('dataStateBase.value = ', dataStateBase.value);
        // console.log('dataStateBase.error = ', dataStateBase.error);
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

    return { ...dataStateBase, setDataStateBase, Render, refetch };
  }
};

// End-user hook that takes a `fetcher` function as input,
// and returns a DataState object that extends DataStateBase
// with a setState(), Render() and refetch() function:
export function useDataState<T, A extends any[] = any[]>(
  {
    fetcher,
    args = [] as unknown as A,
    skipFetch = false
  }: FetchConfig<T, A>
): DataState<T> {
  const dataState = DataState.Init({fetcher, args, skipFetch});

  // Get an actual value by doing initial fetch:
  useEffect(() => {
    dataState.refetch();
    // Only rerun when refetch() changes:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataState.refetch]);

  return dataState;
}

// This helper function takes the fetcher provided to the DataState,
// and attaches it to the DataState's internal data value that is
// tracked and updated with `useState`:
function useFetcher<T, A extends any[] = any[]>({
    fetcher,
    args = [] as unknown as A,
    skipFetch = false
  }: FetchConfig<T, A>,
  setDataStateBase: Dispatch<SetStateAction<DataStateBase<T>>>
): () => Promise<any> {
  // Only create fetcher once and don't update it:
  // Even if the parent re-creates the fetcher each render,
  // this hook will always use the first one.
  // This means that when it closes over variables that might change,
  // it always KEEPS the FIRST VERSION that it received!
  // Those variables have to be provided as ARGUMENTS!
  const stableFetcher = useRef(fetcher).current;

  return useCallback(async () => {
    if (skipFetch) return;

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
      setDataStateBase(DataStateBase.Value(response));
    } catch (err) {
      setDataStateBase(DataStateBase.Error(err));
    }

    // console.log('response = ', response);
    return response;
  }, [stableFetcher, args, skipFetch, setDataStateBase]);
}

// Hook that memoizes the argument array to prevent a new array
// from being created on every render:
// (For inline use in `useDataState()` or `DataState.Init()` calls)
export function useArgs<T extends any[]>(...args: T): T {
  // Prevent infinite loop by NOT refetching unless the arguments actually changed:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => args, args);
}
