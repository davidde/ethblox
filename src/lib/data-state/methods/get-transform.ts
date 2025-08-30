import { useRef, useMemo, useEffect, useCallback } from 'react';
import { DataState, Root, useDummy } from '..';
import { useMethodSetter } from '.';


export function getTransform<T>(dataState: DataState<T>) {
  // Create a new DataState containing a subset of the fields of another:
  const useTransform = <U, B extends any[]>(
    transformer: (data: T, ...args: B) => U,
    transformerArgs?: B,
  ): DataState<U> => {
    // Stabilize the transformer function once - it never changes:
    const stableTransformer = useRef(transformer).current;
    // Stabilize the arguments:
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const stableArgs = useMemo(() => transformerArgs || [] as unknown as B, transformerArgs || [] as unknown as B);

    // Construct the new DataState to return:
    const newDataState = useDummy<U>(false);
    // Set all DataStateMethods on it:
    useMethodSetter(newDataState, dataState.getFetchConfig());

    // Root doesn't contain methods, so won't cause unnecessary rerenders:
    const root = dataState.getRoot();

    const transform = useCallback((root: Root<T>) => {
      switch (root.status) {
        case 'loading':
          newDataState.setLoading();
          break;
        case 'value':
          try {
            const transformedValue = stableTransformer(root.value, ...stableArgs);
            newDataState.setValue(transformedValue);
          } catch (err) {
            // Handle transformer errors gracefully:
            newDataState.setError(
              new Error(`DataState useTransform() transformer function failed:
              ${err instanceof Error ? err.message : 'Unknown error'}`,
              { cause: err })
            );
          }
          break;
        case 'error':
          newDataState.setError(root.error);
          break;
      }

      return newDataState.getRoot();
    }, [root, stableArgs]);

    const newFetch = useCallback(async (): Promise<Root<U>> => {
      const newRoot = await dataState.fetch();
      return transform(newRoot) as Root<U>;
    }, [dataState.fetch, transform]);

    newDataState.fetch = newFetch;

    useEffect(() => {
      transform(root);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, transform]);

    return newDataState;
  }

  return useTransform;
}