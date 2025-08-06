import { useRef, useMemo, useEffect } from 'react';
import { DataState } from '..';


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

    const transformConfig = {
      transformer: stableTransformer,
      args: stableArgs,
    };

    // Construct the new subset DataState to return:
    const transformedData = dataState.useFetch<U, T>(transformConfig);
    // Root doesn't contain methods, so won't cause unnecessary rerenders:
    const root = dataState.getRoot();

    useEffect(() => {
      switch (root.status) {
        case 'loading':
          break;
        case 'value':
          try {
            const transformedValue = stableTransformer(root.value, ...stableArgs);
            transformedData.setValue(transformedValue);
          } catch (err) {
            // Handle transformer errors gracefully:
            transformedData.setError(
              new Error(`DataState useTransform() transformer function failed:
              ${err instanceof Error ? err.message : 'Unknown error'}`,
              { cause: err })
            );
          }
          break;
        case 'error':
          transformedData.setError(root.error);
          break;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [root, stableArgs]);

    return transformedData;
  }

  return useTransform;
}