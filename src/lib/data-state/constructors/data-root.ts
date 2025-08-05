import { useState } from 'react';
import type {
  DataRoot,
  DataRootConstructor,
} from '../types';
import { createErrorRoot, createLoadingRoot, createValueRoot } from './root';


/*********************************************************************
Constructor for the DataRoot type, which is essentially a Root with
its own setters using `useState`.
*********************************************************************/


export const useDataRoot: DataRootConstructor = <T>() => {
  // Initialize a LoadingRoot as root variant for the DataRoot:
  // Calling `createLoadingRoot()` inside `useState()` is required to
  // get a LoadingRoot (DataRoot<undefined>) instead of an `undefined`.
  // This is incorrect usage: `useState<Root<T>>()`!
  // Also, the input for setRoot() needs to be a Root<T>, so correct usage is:
  // `dataRoot.setRoot(createValueRoot(myValue));`
  const [root, setRoot] = useState(createLoadingRoot<T>());

  const setLoading = () => setRoot(createLoadingRoot());
  const setValue = (dataValue: T) => setRoot(createValueRoot(dataValue));
  const setError = (unknownError: unknown, prefix?: string) => setRoot(createErrorRoot(unknownError, prefix));

  return { ...root, setRoot, setLoading, setValue, setError }
};
