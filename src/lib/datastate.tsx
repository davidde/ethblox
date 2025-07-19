import { ReactNode } from 'react';
import LoadingIndicator from '@/components/common/loading-indicator';
import ErrorIndicator from '@/components/common/error-indicator';


interface RenderOptions {
  // Optional callback function for displaying a subfield when the value is present:
  value?: () => ReactNode,
  // Optional short error to display instead of full error:
  error?: string,
  // Optionally don't display a fallback component like Loading- or ErrorIndicators:
  showFallback?: boolean,
  // Optionally display another component instead of the default LoadingIndicator:
  loadingFallback?: ReactNode,
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
      showFallback = true,
      loadingFallback,
    }: RenderOptions = {}) =>
    {
      if (dataValue) return value ? value() : String(dataValue);
      else return showFallback ?
        loadingFallback ? loadingFallback : <LoadingIndicator />
        :
        '';
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
      showFallback = true,
    }: RenderOptions = {}) =>
    {
      return showFallback ?
        <ErrorIndicator
          error={error ? error : errorInstance.message}
        />
        :
        '';
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