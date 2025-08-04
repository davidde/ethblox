import { Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';
import { DataRoot, DataState, FetchConfig, RenderConfig } from './types';
import ErrorIndicator from '@/components/common/indicators/error-indicator';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import LoadingPulse from '@/components/common/indicators/loading-pulse';
import RefetchIndicator from '@/components/common/indicators/refetch-indicator';
import { useConfig } from './constructors/data-state';
import { fetchJson } from './helpers';
import { RenderError } from './types/errors';
import { createLoadingRoot, createValueRoot, createErrorRoot } from './constructors/data-root';


export function useDataStateMethods<T, A extends any[], R>(
  dataRoot: DataRoot<T>,
  setDataRoot: Dispatch<SetStateAction<DataRoot<T>>>,
  config: FetchConfig<T, A, R>
) {
  const setLoading = () => setDataRoot(createLoadingRoot());
  const setValue = (dataValue: T) => setDataRoot(createValueRoot(dataValue));
  const setError = (unknownError: unknown, prefix?: string) => setDataRoot(createErrorRoot(unknownError, prefix));

  // Stabilize args and default to empty array if no args provided:
  const args = useMemo(() => config.args || [] as unknown as A,
  // eslint-disable-next-line react-hooks/exhaustive-deps
    config.args || [] as unknown as A);

  // Stabilize fetcher/postProcess: only create them once and don't update them.
  // Even if the parent re-creates the fetcher each render (e.g. when defined
  // inline), this fetcher remains the same as on its first initialization.
  // This means that when it closes over variables that might change,
  // it always KEEPS the FIRST VERSION that it received!
  // Those variables have to be provided as ARGUMENTS!
  const fetcher = useRef(config.fetcher).current;
  const postProcess = useRef(config.postProcess).current;

  // Attach setDataRoot to fetcher so fetching can update the DataState:
  const fetch = useCallback(async () => {
    try {
      // Skip fetching if one of the arguments is still undefined:
      if (args?.some(arg => arg === undefined)) return;

      let response: R;
      if (fetcher) response = await fetcher(...args);
      else response = await fetchJson(args[0] as string);

      const result = (postProcess ? postProcess(response) : response) as T;

      setDataRoot(createValueRoot(result));
    } catch (err) {
      setDataRoot(createErrorRoot(err));
    }
  }, [fetcher, args, postProcess, setDataRoot]);

  // Get an actual value by doing initial fetch in useEffect():
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const useInit = () => useEffect( () => { fetch() }, [fetch] );

  const Render = <K extends keyof T>(conf: RenderConfig<T, K> = {}): ReactNode => {
    const {
      children, field, staticContent, showFallback = true,
      loadingMessage, loadingPulseColor, showLoadingCallback = true, loadingCallback,
      error, showErrorCallback = true, errorCallback, showErrorSubstitute, errorSubstitute,
      className
    } = conf;

    switch (dataRoot.status) {
      case 'loading':
        if (showFallback) {
          if (showLoadingCallback && loadingCallback) return loadingCallback(className);
          else if (loadingMessage) return <LoadingIndicator message={loadingMessage} className={className} />;
          else return <LoadingPulse loadingPulseColor={loadingPulseColor} content={staticContent} className={className} />;
        } return;
      case 'value':
        if (typeof children === 'function') {
          let value;
          try {
            value = children(dataRoot.value, className);
          } catch (err) {
            // Most likely some data that should have been present in the response was absent,
            // but we cannot be sure, so we'll just display an ErrorIndicator with refetch button,
            // without setting the entire DataState to an ErrorState:
            const error = new RenderError(`'children' render prop pattern function failed.
             Some fields may be incorrectly missing from the response.
             Response: ${JSON.stringify(dataRoot.value)}`,
              { cause: err }
            );
            console.error(error);
            value = <ErrorIndicator error='RenderError' refetch={fetch} className={className} />
          }
          return value;
        } else if (field) {
          return <span className={className}>{ String(dataRoot.value[field]) }</span>;
        } else if (staticContent) {
          return <span className={className}>{ staticContent }</span>;
        } else return <span className={className}>{ String(dataRoot.value) }</span>;
      case 'error':
        // When only the staticContent prop was provided for the Render function,
        // the staticContent should be displayed regardless of possible errors,
        // since the errors have nothing to do with the static content to be displayed:
        if (!children && !field && staticContent) {
          return <span className={className}>{ staticContent }</span>;
        }
        else if (showFallback) {
          if (showErrorCallback && errorCallback) return errorCallback(className);
          if (showErrorSubstitute) return <RefetchIndicator message={errorSubstitute} refetch={fetch} className={className} />;
          else return <ErrorIndicator error={error} refetch={fetch} className={className} />;
        } return;
    }
  }

  // Create a new DataState containing a subset of the fields of another:
  const useSubset = <S, B extends any[]>(
    selectorFn: (data: T, ...args: B) => S,
    selectorArgs?: B,
  ): DataState<S> => {
    // Stabilize the selector function once - it never changes:
    const stableSelector = useRef(selectorFn).current;
    // Stabilize the arguments:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableArgs = useMemo(() => selectorArgs || [] as unknown as B, selectorArgs || [] as unknown as B);

    const subsetPostProcess = useCallback((response: R): S => {
      const result = (postProcess ? postProcess(response) : response) as unknown as T;
      return stableSelector(result, ...stableArgs);
    }, [stableArgs, stableSelector]);

    const subsetConfig = {
      fetcher: fetcher,
      args: args,
      postProcess: subsetPostProcess,
    };

    // Construct the new subset DataState to return:
    const subsetData = useConfig<S, A, R>(subsetConfig);

    useEffect(() => {
      switch (dataRoot.status) {
        case 'loading':
          break;
        case 'value':
          try {
            const selectedValue = stableSelector(dataRoot.value, ...stableArgs);
            subsetData.setValue(selectedValue);
          } catch (err) {
            // Handle selector errors gracefully:
            subsetData.setError(
              new Error(`DataState subset() selector function failed:
                ${err instanceof Error ? err.message : 'Unknown error'}`,
              { cause: err })
            );
          }
          break;
        case 'error':
          subsetData.setError(dataRoot.error);
          break;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataRoot, stableArgs]);

    return subsetData;
  }

  return { setLoading, setValue, setError, fetch, useInit, Render, useSubset };
}