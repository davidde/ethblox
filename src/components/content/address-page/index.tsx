'use client';

import Tokens from './tokens';
import Transactions from './transactions';
import EthBalance from './eth-balance';
import { useSearchParams } from 'next/navigation';
import { isAddress } from 'ethers';
import NotFoundPage from '../error-page/not-found-page';


export default function AddressPage(props: {network: string}) {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash') ?? '';
  const hashOK = isAddress(hash);

  return (
    <main className='m-4 mt-8 md:m-8'>
      <div>
        <h1 className='text-lg font-bold mb-8'>
          Address Details
        </h1>
        <h2 className='capsTitle'>
          ADDRESS
        </h2>
        <p className='max-w-[90vw] break-words'>
          {hash}
        </p>
      </div>
      {
        hash.length !== 42 ?
        <NotFoundPage reason={`Clearly you're joking, right? "${hash}" is not an Ethereum address.`} />
        :
        !hashOK ?
          <div>This is not a valid Ethereum address.</div>
          :
          <div className={props.network === 'mainnet' ?
            'flex flex-col md:flex-row flex-wrap'
            :
            'flex flex-col' // Testnet shows no tokens,
            // so Transactions should show instead (and not to the right)
          }>
            <div>
              <EthBalance
                hash={hash}
                network={props.network}
              />
              <Tokens
                hash={hash}
                network={props.network}
              />
            </div>
            <Transactions
              hash={hash}
              network={props.network}
            />
          </div>
      }
    </main>
  );
}
