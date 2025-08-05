import { DataRoot, DummyConstructor, Root } from '../types';
import { useDataRoot } from './data-root';
import { createLoadingRoot } from './root';


function useDummyMethods<T>() {
  return {
    fetch: async (): Promise<Root<T>> => createLoadingRoot<T>(),
    useLoad: () => undefined,
    Render: () => null,
  }
}

// Initialize a `DataState<T>` type in LoadingState with empty shell methods:
export const useDummy: DummyConstructor = <T>() => {
  // Initialize a DataRoot<T> in Loading state:
  const dataRoot = useDataRoot<T>();

  // Create the DataStateMethods to extend the DataRoot<T> into a full DataState<T>:
  const dataStateMethods = useDummyMethods<T>();

  return { ...dataRoot, ...dataStateMethods };
};