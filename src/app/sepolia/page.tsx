// Alchemy SDK Docs: https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
import { Alchemy, Network } from 'alchemy-sdk';
import Main from '@/components/main';


const alchemy = new Alchemy({
  // You should never expose your API key like this in production level code!
  // See https://docs.alchemy.com/docs/best-practices-for-key-security-and-management,
  // and https://docs.alchemy.com/docs/how-to-use-jwts-for-api-requests.
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
  connectionInfoOverrides: {
    skipFetchSetup: true, // Fix missing response error
  }, // (see: https://github.com/alchemyplatform/alchemy-sdk-js/issues/400)
});

export default async function Page() {
  const network = 'Testnet Sepolia';
  let blockNumber;

  try {
    blockNumber = await alchemy.core.getBlockNumber();
  } catch(error) {
    console.error('getBlockNumber() Error: ', error);
  }

  return (
    <Main
      blockNumber={blockNumber}
      network={network}
      alchemy={alchemy}
    />
  );
}
