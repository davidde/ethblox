import { Utils, Alchemy } from 'alchemy-sdk';
import Tokens from '@/components/address/tokens';
import Transactions from '@/components/address/transactions';
import EthBalance from './eth-balance';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Address(props: Props) {
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
    <main>
      <div className='mt-0 m-4'>
        <p className='text-lg font-bold'>
          Address:
        </p>
        <p className='max-w-[90vw] break-words'>
          {props.hash}
        </p>
      </div>
      {
        badAddress ?
          <div className='m-4'>This address does not exist.</div>
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
