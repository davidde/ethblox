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

    useEffect(() => {
      switch (dataState.status) {
        case 'loading':
          break;
        case 'value':
          try {
            const transformedValue = stableTransformer(dataState.value, ...stableArgs);
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
          transformedData.setError(dataState.error);
          break;
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataState, stableArgs]);

    return transformedData;
  }

  return useTransform;
}