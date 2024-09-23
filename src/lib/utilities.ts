export function truncateAddress(address: string, toLength: number) {
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
  if (transaction.length <= toLength) return transaction;

  const suffix = '...';
  const suffixLength = suffix.length;
  const charsToShow = toLength - suffixLength;

  return transaction.substring(0, charsToShow) + suffix;
};