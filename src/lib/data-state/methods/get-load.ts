import { useEffect } from 'react';
import { DataState } from '..';


export function getLoad<T>(dataState: DataState<T>) {
  // Get an actual value by doing initial fetch in useEffect():
  return () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect( () => { dataState.fetch() }, [dataState.fetch] );
    return dataState;
  }
}