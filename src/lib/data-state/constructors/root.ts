import type {
  ErrorRootConstructor,
  LoadingRootConstructor,
  ValueRootConstructor
} from '../types';


/*********************************************************************
Constructors for the Root<T> type:
`loading()`, `value()` and `error()` return *Roots*,
to be used for initializing or setting a DataRoot!
These functions need to return as Root<T>, and NOT as their
more specific variants like LoadingRoot, ValueRoot or ErrorRoot.
This way, we can re-assign other variants afterwards if required!
*********************************************************************/


// Create LoadingRoot from nothing and return as DataRoot<T>:
export const newLoadingRoot: LoadingRootConstructor = () => ({
  status: 'loading',
  value: undefined,
  error: undefined,
  loading: true,
});

// Create ValueRoot<T> from dataValue and return as DataRoot<T>:
export const newValueRoot: ValueRootConstructor = (dataValue) => ({
  status: 'value',
  value: dataValue,
  error: undefined,
  loading: false,
});

// Create ErrorRoot from `unknown` error and return as DataRoot<T>:
export const newErrorRoot: ErrorRootConstructor = (unknownError, errorPrefix?) => {
  let errorInstance: Error;

  if (unknownError instanceof Error) {
    if (errorPrefix) unknownError.message = `${errorPrefix} ${unknownError.message}`;
    errorInstance = unknownError as Error;
  }
  else { // `String(unknownError)` could technically still fail if someone throws bad objects:
    errorInstance = errorPrefix ?
      new Error(`${errorPrefix} ${String(unknownError)}`) : new Error(String(unknownError));
  }

  console.error(errorInstance);

  return {
    status: 'error',
    value: undefined,
    error: errorInstance,
    loading: false,
  };
};
