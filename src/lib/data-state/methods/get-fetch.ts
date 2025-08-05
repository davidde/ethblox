import { useCallback, useMemo, useRef } from 'react';
import { DataState, FetchConfig } from '../types';
import { fetchJson } from '../helpers';
import { createLoadingRoot, createValueRoot, createErrorRoot } from '../constructors/root';


export function getFetch<T, A extends any[] = any[]>(
  dataState: DataState<T>,
  config: FetchConfig<T, A>,
) {
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

  // Attach setRoot to fetcher so fetching can update the DataState:
  const fetch = useCallback(async () => {
    // Skip fetching if one of the arguments is still undefined:
    if (args?.some(arg => arg === undefined)) return createLoadingRoot<T>();

    let result;
    try {
      let response: T;
      if (fetcher) response = await fetcher(...args);
      else response = await fetchJson(args[0] as string);

      result = createValueRoot(response);
    } catch (err) {
      result = createErrorRoot<T>(err);
    }
    dataState.setRoot(result);
    return result;
  }, [fetcher, args, dataState.setRoot]);

  return fetch;
}