'use client';

import { Utils } from 'alchemy-sdk';
import Tokens from './tokens';
import Transactions from './transactions';
import EthBalance from './eth-balance';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAlchemy } from '@/lib/utilities';
import { isAddress } from 'ethers';


export default function AddressPage(props: {network: string}) {
  const alchemy = getAlchemy(props.network);
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash') ?? '';
  const okAddress = isAddress(hash);

  const [ethBalance, setEthBalance] = useState('');

  useEffect(() => {
    let success = false;

    async function getBalance() {
      while (!success) {
        try {
          const data = await alchemy.core.getBalance(hash, 'latest');
          setEthBalance(Utils.formatEther(data));
          success = true;
        } catch(err) {
          if (err instanceof Error && err.message.startsWith('bad address checksum')) {
            console.error('getBalance() Error: ', err.message);
            success = true;
          } else {
            success = false;
          }
        }
      }
    }

    getBalance();
  }, [hash, alchemy]); // Re-run effect whenever the 'hash' changes

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
        !okAddress ?
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
                ethBalance={ethBalance}
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
              alchemy={alchemy}
            />
          </div>
      }
    </main>
  );
}
