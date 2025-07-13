'use client';

import Tokens from './tokens';
import Transactions from './transactions';
import EthBalance from './eth-balance';
import { useSearchParams } from 'next/navigation';
import { isAddress } from 'ethers';
import NotFoundPage from '../error-page/not-found-page';
import BreakMobile from '@/components/common/break-mobile';


export default function AddressPage(props: {network: string}) {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash') ?? '';
  const hashOK = isAddress(hash);

  if (hash.length !== 42)
    return <NotFoundPage reason={`Surely you're joking, right?\n
      "${hash}" is not an Ethereum address.`} />;
  else if (!hashOK) return <div>This is not a valid Ethereum address.</div>

  // Testnet shows no tokens, so Transactions should show instead, and not to the right:
  const wrapTransactions = props.network === 'mainnet' ? 'md:flex-row flex-wrap' : '';

  return (
    <main className='m-4 mt-8 md:m-8'>
      <div className='mb-8'>
        <span className='text-[1.25rem] font-bold'>Address: &nbsp;</span>
        <BreakMobile />
        <span className='break-all font-medium'>{hash}</span>
      </div>
      <div className={`flex flex-col ${wrapTransactions}`}>
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
    </main>
  );
}
