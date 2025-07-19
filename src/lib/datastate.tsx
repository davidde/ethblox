import { ReactNode } from 'react';
import LoadingIndicator from '@/components/common/loading-indicator';
import ErrorIndicator from '@/components/common/error-indicator';


interface RenderOptions {
  // Optional callback function for displaying a subfield when the value is present:
  value?: () => ReactNode,
  // Optional short error to display instead of full error:
  error?: string,
  // Optionally don't display a fallback component like Loading- or ErrorIndicators:
  fallback?: boolean,
  // Optional className for fallback component when no value is present;
  // this can be useful for preserving width/height to prevent layout shifts:
  fallbackClass?: string,
}

type ValueState<T> = {
  value?: T;
  error: undefined;
  render: (options?: RenderOptions) => ReactNode;
};
type ErrorState = {
  value: undefined;
  error?: Error;
  render: (options?: RenderOptions) => ReactNode;
};

type DataState<T> = ValueState<T> | ErrorState;

// Factory functions to return the `DataState` type,
// as well as implement the associated render() function:
const DataState = {
  // Create ValueState<T> from value or nothing when initializing:
  value: <T,>(dataValue?: T): DataState<T> => {
    let render = ({
      value,
      fallback = true,
      fallbackClass,
    }: RenderOptions = {}) =>
    {
      if (dataValue) return value ? value() : String(dataValue);
      else return fallback ?
        <LoadingIndicator className={fallbackClass ?? ''} />
        :
        <span className={fallbackClass ?? ''}>&nbsp;</span>;
    };

    return {
      value: dataValue,
      error: undefined,
      render
    };
  },

  // Create ErrorState from `unknown` error, to be used in `catch` block:
  error: (unknownError: unknown, errorPrefix?: string): ErrorState => {
    let errorInstance: Error;

    if (unknownError instanceof Error) {
      if (errorPrefix) unknownError.message = `${errorPrefix} ${unknownError.message}`;
      errorInstance = unknownError as Error;
    }
    else { // `String(err)` could technically still fail if someone throws bad objects:
      errorInstance = errorPrefix ?
        new Error(`${errorPrefix} ${String(unknownError)}`) : new Error(String(unknownError));
    }

    let render = ({
      error,
      fallback = true,
      fallbackClass,
    }: RenderOptions = {}) =>
    {
      return fallback ?
        <ErrorIndicator
          className={fallbackClass ?? ''}
          error={error ? error : errorInstance.message}
        />
        :
        <span className={fallbackClass ?? ''}>&nbsp;</span>;
    };

    console.error(errorInstance);
    return {
      value: undefined,
      error: errorInstance,
      render,
    };
  }
};

export default DataState;