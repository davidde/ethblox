import type {
  DataRoot,
  DataStateMethods,
} from './types';


// Note there is a duplicate DataState<T> definition in `./types.ts`,
// because Typescript does not seem capable of exporting a type from
// another file when there is already a namespace with the same name!
export type DataState<T> = DataRoot<T> & DataStateMethods<T>;

export * from './types';
export * from './types/errors';
export * from './helpers';

// export namespace DataState {
  
// }

export { useDummy } from './constructors/dummy';
export { useDataState } from './constructors/data-state';