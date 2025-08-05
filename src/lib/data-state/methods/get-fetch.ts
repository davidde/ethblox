import { Fetcher } from '../types';
import { fetchJson } from '../helpers';
import { newLoadingRoot, newValueRoot, newErrorRoot } from '../constructors/root';


export function getFetch<T, A extends any[] = any[]>(
  fetcher: Fetcher<T, A> | undefined,
  args: A,
) {
  return async () => {
    // Skip fetching if one of the arguments is still undefined:
    if (args?.some(arg => arg === undefined)) return newLoadingRoot<T>();

    let result;
    try {
      let response: T;
      if (fetcher) response = await fetcher(...args);
      else response = await fetchJson(args[0] as string);

      result = newValueRoot(response);
    } catch (err) {
      result = newErrorRoot<T>(err);
    }
    return result;
  };
}