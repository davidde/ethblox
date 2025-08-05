import { useEffect } from 'react';
import { DataState } from '..';


export function getLoad<T>(dataState: DataState<T>) {
  // Get an actual value by doing initial fetch in useEffect():
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return () => useEffect( () => { dataState.fetch() }, [dataState.fetch] );
}