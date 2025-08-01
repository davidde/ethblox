import { FetchError } from '../types/errors';


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
