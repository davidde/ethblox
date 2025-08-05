import { Fetcher } from '../types';
import { FetchError } from '../types/errors';
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

// To be used as a wrapper for fetch() inside useDataState inline fetcher definition:
// (This allows the types to match with the DataState's, instead of returning a fetch Response type)
export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Fetch failed, status: ${response.status}`);

  const json = await response.json();
  const result = 'result' in json ? json.result : json;
  if (!result) throw new FetchError(`Empty json response or result.
            json: ${JSON.stringify(json)}
            URL: ${url}`);

  return result as T;
}