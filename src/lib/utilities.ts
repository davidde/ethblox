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