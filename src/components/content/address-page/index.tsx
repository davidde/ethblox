import { Utils, Alchemy } from 'alchemy-sdk';
import Tokens from './tokens';
import Transactions from './transactions';
import EthBalance from './eth-balance';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function AddressPage(props: Props) {
  let ethBalance, badAddress;
  let success = false;

  while (!success) {
    try {
      ethBalance = Utils.formatEther(await props.alchemy.core.getBalance(props.hash, 'latest'));
      badAddress = false; success = true;
    } catch(err) {
      if (err instanceof Error && err.message.startsWith('bad address checksum')) {
        console.error('getBalance() Error: ', err.message);
        badAddress = true; success = true;
      } else {
        badAddress = false; success = false;
      }
    }
  }

  return (
    <main className='m-4 mt-8 md:m-8'>
      <div>
        <h1 className='text-lg font-bold mb-8'>
          Address Details
        </h1>
        <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>
          ADDRESS
        </h2>
        <p className='max-w-[90vw] break-words'>
          {props.hash}
        </p>
      </div>
      {
        badAddress ?
          <div>This address does not exist.</div>
          :
          <div className={props.network === 'mainnet' ?
            'flex flex-col md:flex-row flex-wrap'
            :
            'flex flex-col' // Testnet shows no tokens,
            // so Transactions should show instead (and not to the right)
          }>
            <div>
              <EthBalance
                ethBalance={ethBalance!}
                network={props.network}
              />
              <Tokens
                hash={props.hash}
                network={props.network}
                alchemy={props.alchemy}
              />
            </div>
            <Transactions
              hash={props.hash}
              network={props.network}
              alchemy={props.alchemy}
            />
          </div>
      }
    </main>
  );
}
