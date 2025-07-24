import { ReactNode } from 'react';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';
import ErrorIndicator from '@/components/common/indicators/error-indicator';


// Options to configure the `DataState`'s Render method that displays
// either the `ValueState`'s value, or the `ErrorState`'s error.
interface RenderOptions {
  // Optional callback function for rendering a subfield of the `ValueState`'s value IFF that value is present:
  value?: () => ReactNode,
  // Optional short error to display instead of full error:
  error?: string,
  // Optionally don't display fallback components like Loading- or ErrorIndicators:
  showFallback?: boolean,
  // Optionally display another component instead of the default LoadingIndicator:
  loadingFallback?: ReactNode,
  // Optionally display another component instead of the default ErrorIndicator:
  errorFallback?: ReactNode,
  // Optional className for the fallback component when it exists:
  fallbackClass?: string,
}

type ValueState<T> = {
  value?: T;
  error: undefined;
  Render: (options?: RenderOptions) => ReactNode;
};
type ErrorState = {
  value: undefined;
  error?: Error;
  Render: (options?: RenderOptions) => ReactNode;
};

// Calling `DataState.value()` inside `useState()` is required
// to get a `DataState<undefined>` instead of an `undefined`!
// `type DataState<T> = ValueState<T> | ErrorState`, so:
// `ValueState<T>.value` either has `value<T>` OR `undefined`,
// the latter indicating it is still in a loading state, OR in ErrorState.
// `ErrorState.error` either has an Error object or undefined.
// The DataState.Render() method can be called at all times;
// in Value- as well as ErrorState!
// It will render the apropriate component,
// either a LoadingIndicator, an ErrorIndicator, or the value.
// If the DataState's value exists, the render method will render
// its value callback function if that is present,
// or default to rendering the DataState's value directly if not.
type DataState<T> = ValueState<T> | ErrorState;

// Factory functions to return the `DataState` type,
// as well as implement the associated Render() function:
const DataState = {
  // Create ValueState<T> from value or nothing when initializing:
  value: <T,>(dataValue?: T): DataState<T> => {
    const Render = ({
      value,
      showFallback = true,
      loadingFallback,
      fallbackClass,
    }: RenderOptions = {}) =>
    {
      if (dataValue) return value ? value() : String(dataValue);
      else return showFallback ?
        ( loadingFallback ? loadingFallback : <LoadingIndicator className={fallbackClass} /> )
        :
        '';
    };

    return {
      value: dataValue,
      error: undefined,
      Render
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

    const Render = ({
      error,
      showFallback = true,
      errorFallback,
      fallbackClass,
    }: RenderOptions = {}) =>
    {
      return showFallback ?
        ( errorFallback ? errorFallback : <ErrorIndicator error={error} className={fallbackClass} /> )
        :
        '';
    };

    console.error(errorInstance);
    return {
      value: undefined,
      error: errorInstance,
      Render,
    };
  }
};

export default DataState;