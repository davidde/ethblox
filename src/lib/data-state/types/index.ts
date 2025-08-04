import { ReactNode } from 'react';


export type LoadingRoot = {
  status: 'loading';
  value: undefined;
  error: undefined;
  loading: true;
};
export type ValueRoot<T> = {
  status: 'value';
  value: T;
  error: undefined;
  loading: false;
};
export type ErrorRoot = {
  status: 'error';
  value: undefined;
  error: Error;
  loading: false;
};

export type DataRoot<T> = LoadingRoot | ValueRoot<T> | ErrorRoot;

export type LoadingRootConstructor = <T,>() => DataRoot<T>;
export type ValueRootConstructor = <T,>(dataValue: T) => DataRoot<T>;
export type ErrorRootConstructor = <T,>(unknownError: unknown, errorPrefix?: string) => DataRoot<T>;

// DataState Methods that extend the DataRoot<T> into a full DataState<T> type:
export type DataStateMethods<T> = {
  // These methods set the DataRoot value using React's useState.
  // CAREFUL: Requires using `useEffect`, `useCallback` or event handlers!
  // Do NOT use it directly in a component's body or they will cause an infinite rerender loop!
  setLoading: () => void;
  setValue: (value: T) => void;
  setError: (error: unknown, prefix?: string) => void;
  // This is the fetch function that is used to initialize the DataState,
  // and can be called to refetch when an error occurred.
  fetch: () => Promise<void>;
  // Populate the DataRoot with data from an initial fetch in useEffect():
  useInit: () => void;
  // The DataState.Render() method can be called at all times; in Value-, Error-,
  // as well as LoadingState! It will render the apropriate component,
  // either the value, an ErrorIndicator, or a LoadingIndicator.
  // If the DataState's value exists, the Render method will first check if the user
  // provided a value callback function (e.g. to render a subfield of the DataState),
  // and render that, or otherwise default to rendering the DataState's value directly.
  Render: <K extends keyof T>(options?: RenderConfig<T, K>) => ReactNode;
  // Create a new DataState containing a subset of the fields of another:
  useTransform: <U, A extends any[]>(
    transformer: Transformer<U, T, A>,
    args?: A,
  ) => DataState<U>;
  // Create a new DataState by composing the values from 2 different DataStates:
  // (E.g. When some data transformation requires data from 2 different fetches)
  // useCompose: <U, C>(
  //   otherDataState: DataState<U>,
  //   combiner: (thisData: T, otherData: U) => C,
  // ) => DataState<C>;
};

// Options to configure the `DataState`'s Render method that displays
// either the `ValueState`'s value, the `ErrorState`'s error, or a LoadingIndicator.
export type RenderConfig<T, K extends keyof T> = {
  // Optionally provide a callback function as the only child of the Render component,
  // to transform the DataState's value before rendering it. If you specify the data
  // parameter, you can access all fields contained in the DataState's value.
  // You can also specify className as the second parameter, to use the `className`
  // prop passed to the Render component inside this function. (See last prop below;
  // the benefit of doing this is that this class is ALSO set on fallback components.)
  // `Pick<T, K>` constructs a NEW type by selecting a set of properties K from a type T.
  // This guarantees that the data object we pass in will only contain keys specified in K.
  children?: (data: Pick<T, K>, className?: string) => ReactNode;
  // Optionally render a specific key/field of the DataState's value (IFF it is present):
  // (If children() is provided, it will take precedence over field!)
  field?: K;
  // Optionally provide static content to render.
  // This is useful for content that should only display when other data
  // is already available to display, or show a LoadingIndicator when not ready available.
  // If children() or field are provided, they will take precedence over staticContent!
  // The staticContent is also used for setting the width of the LoadingPulse component,
  // so it can also be used for this even when providing a field or children(), which
  // will take precedence for the value that will be displayed.
  staticContent?: ReactNode;

  // Optionally don't display fallback components like Loading- or ErrorIndicators:
  // (`showFallback` takes precedence over both showLoading and showError!)
  showFallback?: boolean;

  // Optional message to display while loading:
  loadingMessage?: string;
  // Optional className for just the LoadingPulse component, e.g. for setting its color,
  // which it takes from currentcolor (i.e. text color) by default:
  // (The LoadingPulse component will only display when the above
  // loadingMessage is NOT set, otherwise only the message will appear.)
  loadingPulseColor?: string;
  // Optionally display a fallback component while loading:
  // (True by default, so you only need to provide the `loadingCallback()`
  // function below to actually display it.)
  showLoadingCallback?: boolean;
  // Optionally display another component instead of the default LoadingIndicator:
  // (Can optionally use the `className` below, just like `children()`.)
  loadingCallback?: (className?: string) => ReactNode;

  // Optional error message to display instead of 'Error':
  error?: string;
  // Optionally display a fallback component when an error occurred:
  // (True by default, so you only need to provide the `errorCallback()`
  // function below to actually display it.)
  showErrorCallback?: boolean;
  // Optionally display another component instead of the default ErrorIndicator:
  // (Can optionally use the `className` below, just like `children()`.)
  errorCallback?: (className?: string) => ReactNode;
  // Optionally display a substitute message on error (i.e. NOT red):
  showErrorSubstitute?: boolean;
  // The message to display instead of the error:
  errorSubstitute?: string;

  // Optional shared className for all displayed components.
  // This is useful for layout/positioning that has to be the same for whatever
  // component that is eventually displayed, like Loading- or ErrorIndicators:
  className?: string;
}

export type DataState<T> = DataRoot<T> & DataStateMethods<T>;

// FetchConfig is used to initialize a DataState<T>, which is a DataRoot<T>,
// together with its fetching function for potentially refetching it:
export type FetchConfig<T, A extends any[] = []> = {
  // `fetcher` takes any async function, and can be omitted
  // if the fetcher is the standard Fetch API:
  fetcher?: (...args: A) => Promise<T>;
  // Optionally provide arguments for the fetcher:
  args?: A;
};

// Function to transform an object by selecting/transforming the input object
// and returning a modified object containing only the selected fields.
// S is the type of the resulting selection, I is the input type, and A are the
// OPTIONAL arguments from outside the caller to be used for transforming the data:
type Transformer<T, I, A extends any[] = any[]> = (input: I, ...args: A) => T;

// Config for selecting/transforming an input object and returning
// a new, modified object containing only the selected/transformed fields.
// T is the type of the resulting transformation, I is the input type,
// and A are the OPTIONAL arguments from outside the caller to be used
// for transforming the data:
export type TransformConfig<T, I, A extends any[] = any[]> = {
  // Transformer does the actual transformation by returning a selection of fields:
  transformer: Transformer<T, I, A>;
  // Optionally provide arguments for the transformer:
  args?: A;
};

// A DataState is either initialized from a fetcher function,
// or transformed from an input object:
export type DataStateConstructor = <T, I = T, A extends any[] = any[]>(
  config: FetchConfig<T, A> | TransformConfig<T, I, A>
) => DataState<T>;
