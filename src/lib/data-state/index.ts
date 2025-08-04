import type {
  DataRoot,
  DataStateConstructor,
  DataStateMethods,
} from './types';
import * as constructors from './constructors/data-state';


export * from './types';
export * from './types/errors';
export * from './helpers';

// Note there is a duplicate DataState<T> definition in `./types.ts`,
// because Typescript does not seem capable of exporting a type from
// another file when there is already a namespace with the same name!
export type DataState<T> = DataRoot<T> & DataStateMethods<T>;

export namespace DataState {
  export const useConfig: DataStateConstructor = constructors.useConfig;
}

export const useDataState: DataStateConstructor = constructors.useDataState;