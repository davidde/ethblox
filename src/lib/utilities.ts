// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network } from 'alchemy-sdk';


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