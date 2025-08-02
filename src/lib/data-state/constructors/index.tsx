import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorIndicator from '@/components/common/indicators/error-indicator';
import type {
  DataStateConstructor,
  FetchConfig,
  RenderConfig,
} from '../types';
import { fetchJson } from './helpers';
import * as DataRoot from './data-root';
import { RenderError } from '../types/errors';


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
  const [dataRoot, setRoot] = useState(DataRoot.loading<T>());
  const setLoading = () => setRoot(DataRoot.loading<T>());
  const setValue = (dataValue: T) => setRoot(DataRoot.value(dataValue));
  const setError = (unknownError: unknown, prefix?: string) => setRoot(DataRoot.error(unknownError, prefix));

  // Default to empty array if no args provided:
  let args = config.args || [] as unknown as A;
  // Stabilize args:
  // eslint-disable-next-line react-hooks/exhaustive-deps
  args = useMemo(() => args, args);

  // Stabilize fetcher: only create it once and don't update it.
  // Even if the parent re-creates the fetcher each render (e.g. when defined
  // inline), this fetcher remains the same as on its first initialization.
  // This means that when it closes over variables that might change,
  // it always KEEPS the FIRST VERSION that it received!
  // Those variables have to be provided as ARGUMENTS!
  const fetcher = useRef(config.fetcher).current;
  const postProcess = useRef(config.postProcess).current;

  // Attach setRoot to fetcher so fetching can update the DataState:
  const fetch = useCallback(async () => {
    try {
      // Skip fetching if one of the arguments is still undefined:
      if (args?.some(arg => arg === undefined)) return;

      let response: R;
      if (fetcher) response = await fetcher(...args);
      else response = await fetchJson(args[0] as string);

      const result = postProcess ? postProcess(response) : response;

      setRoot(DataRoot.value(result as T));
    } catch (err) {
      setRoot(DataRoot.error(err));
    }
  }, [fetcher, args, postProcess]);

  // Get an actual value by doing initial fetch in useEffect():
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useInit = () => useEffect(() => { fetch() }, [fetch]);

  const getField = <K extends keyof T>(key: K) => {
    return dataRoot.value?.[key];
  }

  const Render = <K extends keyof T>(conf: RenderConfig<T, K> = {}): ReactNode => {
    const { valueCallback, field, staticContent, error, loadingMessage, loadingPulseColor,
      showFallback = true, loadingFallback, errorFallback, jointClass } = conf;

    switch (dataRoot.status) {
      case 'loading':
        if (showFallback) {
          if (loadingFallback) return loadingFallback;
          else if (loadingMessage) return <LoadingIndicator message={loadingMessage} className={jointClass} />;
          else return <LoadingPulse loadingPulseColor={loadingPulseColor} className={jointClass} content={staticContent} />;
        } return;
      case 'value':
        if (valueCallback) {
          let value;
          try {
            value = valueCallback(dataRoot.value, jointClass);
          } catch (err) {
            // Most likely some data that should have been present in the response was absent,
            // so we'll just offer a refetch button for trying again:
            const error = new RenderError(`Value callback function failed.
             Some fields may be incorrectly missing from the response.
             Response: ${JSON.stringify(dataRoot.value)}`,
              { cause: err }
            );
            console.error(error);
            value = <ErrorIndicator refetch={fetch} error='RenderError' className={jointClass} />
          }
          return value;
        } else if (field) {
          return <span className={jointClass}>{ String(dataRoot.value[field]) }</span>;
        } else if (staticContent) {
          return <span className={jointClass}>{ staticContent }</span>;
        } else return <span className={jointClass}>{ String(dataRoot.value) }</span>;
      case 'error':
        // When only the staticContent prop was provided for the Render function,
        // the staticContent should be displayed regardless of possible errors,
        // since the errors have nothing to do with the static content to be displayed:
        if (!valueCallback && !field && staticContent) {
          return <span className={jointClass}>{ staticContent }</span>;
        }
        else if (showFallback) {
          return errorFallback ?? <ErrorIndicator refetch={fetch} error={error} className={jointClass} />;
        } return;
    }
  }

  return { ...dataRoot, setRoot, setLoading, setValue, setError, fetch, useInit, getField, Render };
};

// End-user hook that creates a DataState<T> object from a FetchConfig
// and directly runs the fetch to populate it with data:
// (useConfig() also creates a DataState, but doesn't actually run the fetch)
export const useDataState: DataStateConstructor = (config) => {
  const state = useConfig(config);
  state.useInit();

  return state;
}
