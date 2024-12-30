// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network, Utils, BigNumber } from 'alchemy-sdk';


export function createAlchemy(network: string) {
  return new Alchemy({
    // You should never expose your API key like this in production level code!
    // See https://docs.alchemy.com/docs/best-practices-for-key-security-and-management,
    // and https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests.
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: network === 'mainnet' ? Network.ETH_MAINNET : Network.ETH_SEPOLIA,
    connectionInfoOverrides: {
      skipFetchSetup: true, // Fix missing response error
    }, // (see: https://github.com/alchemyplatform/alchemy-sdk-js/issues/400)
  });
}

export function getEtherValueFromWei(wei: BigNumber, decimals: number) {
  return Math.round(+(Utils.formatEther(wei)) * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function getDateFromUnixSecs(secs: number) {
  return new Date(secs * 1000).toString();
}

export function getSecsFromUnixSecs(secs: number) {
  return Math.round(Date.now() / 1000 - secs);
}

export function getSecsFromDateTimeString(datetime: string) {
  return Math.round(Date.now()/1000 - Date.parse(datetime)/1000);
}

export function getBlockAgeFromSecs(secs: number) {
  const secsInMinute = 60;
  const secsInHour = 60 * secsInMinute;
  const secsInDay = secsInHour * 24;

  let age, blockAge;
  if (secs > secsInDay) {
    age = Math.floor(secs/secsInDay);
    blockAge = age > 1 ? `${age} days` : `${age} day`;
  } else if (secs > secsInHour) {
    age = Math.floor(secs/secsInHour);
    blockAge = age > 1 ? `${age} hours` : `${age} hour`;
  } else if (secs > secsInMinute) {
    age = Math.floor(secs/secsInMinute);
    blockAge = age > 1 ? `${age} mins` : `${age} min`;
  } else {
    age = Math.floor(secs);
    blockAge = age > 1 ? `${age} secs` : `${age} sec`;
  }

  return blockAge;
}

export function truncateAddress(address: string, toLength: number) {
  if (!address) return null;
  if (address.length <= toLength) return address;

  const separator = '...';
  const separatorLength = separator.length;
  const charsToShow = toLength - separatorLength;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);

  return (
    address.substring(0, frontChars) +
    separator +
    address.substring(address.length - backChars)
  );
};

export function truncateTransaction(transaction: string, toLength: number) {
  if (!transaction) return null;
  if (transaction.length <= toLength) return transaction;

  const suffix = '...';
  const suffixLength = suffix.length;
  const charsToShow = toLength - suffixLength;

  return transaction.substring(0, charsToShow) + suffix;
};

export function isAddress(hash: string) {
  const allowed = /^[0-9a-zA-Z]+$/;
  return hash.length === 42 && hash.startsWith('0x') && allowed.test(hash);
}