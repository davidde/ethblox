import { useState } from 'react';
import type {
  DataRootConstructor,
} from '../types';
import { newErrorRoot, newLoadingRoot, newValueRoot } from './root';


/*********************************************************************
Constructor for the DataRoot type, which is essentially a Root with
its own setters using `useState`.
*********************************************************************/


export const useDataRoot: DataRootConstructor = <T>(isDummyFlag: boolean = false) => {
  // Initialize a LoadingRoot as root variant for the DataRoot:
  // Calling `newLoadingRoot()` inside `useState()` is required to
  // get a LoadingRoot (DataRoot<undefined>) instead of an `undefined`.
  // This is incorrect usage: `useState<Root<T>>()`!
  // Also, the input for setRoot() needs to be a Root<T>, so correct usage is:
  // `dataRoot.setRoot(newValueRoot(myValue));`
  const [root, setRoot] = useState(newLoadingRoot<T>(isDummyFlag));

  const setLoading = () => setRoot(newLoadingRoot(isDummyFlag));
  const setValue = (dataValue: T) => setRoot(newValueRoot(dataValue));
  const setError = (unknownError: unknown, prefix?: string) => setRoot(newErrorRoot(unknownError, prefix));

  const isDummy = () => root.error === null;

  return { ...root, setRoot, setLoading, setValue, setError, isDummy }
};
