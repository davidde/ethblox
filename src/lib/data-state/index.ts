import type {
  DataRoot,
  LoadingRootConstructor,
  ValueRootConstructor,
  ErrorRootConstructor,
  DataStateConstructor,
  DataStateMethods,
} from './types';
import * as constructors from './constructors';
import * as rootConstructors from './constructors/data-root';


export * from './types';
export * from './types/errors';
export * from './constructors/helpers';

// Note there is a duplicate DataState<T> definition in `./types.ts`,
// because Typescript does not seem capable of exporting a type from
// another file when there is already a namespace with the same name!
export type DataState<T> = DataRoot<T> & DataStateMethods<T>;

export namespace DataState {
  export const loading: LoadingRootConstructor = rootConstructors.loading;
  export const value: ValueRootConstructor = rootConstructors.value;
  export const error: ErrorRootConstructor = rootConstructors.error;
  export const useConfig: DataStateConstructor = constructors.useConfig;
}

export const useDataState: DataStateConstructor = constructors.useDataState;