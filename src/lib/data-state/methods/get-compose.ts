import { useCallback, useEffect } from 'react';
import { DataState, Root, useDummy } from '..';
import { useMethodSetter } from '.';


export function getCompose<T>(dataState: DataState<T>) {
  // Create a new DataState containing a subset of the fields of another:
  const useCompose = <O,>(otherDataState: DataState<O>): DataState<any> => {
    // Construct the new composed DataState to return:
    const composedData = useDummy<[T, O]>(false);
    // Set all DataStateMethods on it:
    useMethodSetter(composedData, dataState.getFetchConfig());

    const compose = useCallback((thisData: Root<T>, otherData: Root<O>) => {
      if (thisData.loading || otherData.loading) {
        composedData.setLoading();
      } else if (thisData.value && otherData.value) {
        composedData.setValue([thisData.value, otherData.value]);
      } else {
        if (thisData.error && otherData.error) {
          composedData.setError(
            new Error(`Error on both composed DataStates:
              1: ${thisData.error.message}
              2: ${otherData.error.message}`,
              { cause: [ thisData.error, otherData.error ] }
            )
          );
        }
        else if (thisData.error) {
          composedData.setError(
            new Error(`Error on first composed DataState:
              ${thisData.error.message}`,
              { cause: thisData.error }
            )
          );
        }
        else if (otherData.error) {
          composedData.setError(
            new Error(`Error on second composed DataState:
              ${otherData.error.message}`,
              { cause: otherData.error }
            )
          );
        } else composedData.setError(new Error('Impossible Error'));
      }

      return composedData.getRoot();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const newFetch = useCallback(async () => {
      const composedFetch = await Promise.all([dataState.fetch(), otherDataState.fetch()]);

      return compose(composedFetch[0], composedFetch[1]);
    }, [otherDataState, compose]);

    composedData.fetch = newFetch;
    const thisRoot = dataState.getRoot();
    const otherRoot = otherDataState.getRoot();

    useEffect(() => {
      compose(thisRoot, otherRoot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compose, thisRoot, otherRoot]);

    return composedData;
  }

  return useCompose;
}