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

// Helper function to create a subset from an object:
export function pickFields<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    if (object.hasOwnProperty(key)) {
      acc[key] = object[key];
    }
    return acc;
  }, {} as Pick<T, K>);
}

// Type guard to safely check if a value is an object:
export function isObject(value: any): value is object {
  return typeof value === 'object' && value !== null;
}
