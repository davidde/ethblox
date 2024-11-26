import { Utils, Alchemy } from 'alchemy-sdk';
import Tokens from '@/components/address/tokens';
import Transactions from '@/components/address/transactions';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function Address(props: Props) {
  let ethBalance, badAddress;

  try {
    ethBalance = Utils.formatEther(await props.alchemy.core.getBalance(props.hash, 'latest'));
    badAddress = false;
  } catch {
    badAddress = true;
  }

  return (
    <div>
      <div className='m-4'>
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
            <Tokens
              hash={props.hash}
              ethBalance={ethBalance!}
              network={props.network}
              alchemy={props.alchemy}
            />
            <Transactions
              hash={props.hash}
              network={props.network}
              alchemy={props.alchemy}
            />
          </div>
      }
    </div>
  );
}
