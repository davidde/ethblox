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

// The DataState.Render() method can be called at all times;
// in Value- as well as ErrorState!
// It will render the apropriate component,
// either a LoadingIndicator, an ErrorIndicator, or the value.
// If the DataState's value exists, the render method will render its value
// callback function (e.g. to get a subfield of the value) if that is present,
// or default to rendering the DataState's value directly if not.
interface DataStateMethods<T> {
  // CAREFUL: `setDataStateBase` requires using `useEffect`, `useCallback` or event handlers!
  // Do NOT use it directly in a component's body or this will cause an infinite rerender loop!
  setDataStateBase: Dispatch<SetStateAction<DataStateBase<T>>>,
  Render: (options?: RenderConfig) => ReactNode;
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

// FetchConfig is used to initialize the `useDataState()` hook.
// This hook returns a DataState<T>, together with its fetching function for potentially refetching it.
// * `fetcher`: takes either the `fetch` function directly, or any async function.
// * `args`: optional and takes the arguments for the fetcher.
// * `skipFetch`: also optional and should be set to true if any input for the fetcher
//    is incorrectly undefined or null, and fetching should be aborted.
interface FetchConfig<T, A extends any[] = any[]> {
  fetcher: (...args: A) => Promise<T>;
  args?: A;
  skipFetch?: boolean
};

// Factory functions to create the `DataState` type:
export const DataState = {
  // Create ValueState<T> from value or nothing when initializing:
  Value: <T, A extends any[] = any[]>({
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
        // console.log('Value; dataStateBase.value = ', dataStateBase.value);
        // console.log('Value; dataStateBase.error = ', dataStateBase.error);

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
  },

  // Create ErrorState from `unknown` error, to be used in `catch` block:
  Error: <T, A extends any[] = any[]>({
      fetcher,
      args = [] as unknown as A,
      skipFetch = false
    }: FetchConfig<T, A>,
    error: string,
  ): DataState<T> => {
    const [dataStateBase, setDataStateBase] = useState(DataStateBase.Error<T>(error));
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
        // console.log('Error; dataStateBase.value = ', dataStateBase.value);
        // console.log('Error; dataStateBase.error = ', dataStateBase.error);

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
// with a Render() and refetch() function:
export function useDataState<T, A extends any[] = any[]>(
  {
    fetcher,
    args = [] as unknown as A,
    skipFetch = false
  }: FetchConfig<T, A>
): DataState<T> {
  const dataState = DataState.Value({fetcher, args, skipFetch});

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
  // Prevent infinite loop by NOT refetching unless the arguments or fetcher actually changed:
  // (Ideally do a deep comparison check for certainty)
  const memoArgs = useMemo(() => args, [JSON.stringify(args)]);
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
      response = await stableFetcher(...memoArgs);
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
  }, [stableFetcher, memoArgs, skipFetch, setDataStateBase]);
}
