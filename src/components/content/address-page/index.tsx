'use client';

import Tokens from './tokens';
import Transactions from './transactions';
import EthBalance from './eth-balance';
import { useSearchParams } from 'next/navigation';
import { isAddress } from 'ethers';
import NotFoundPage from '../error-page/not-found-page';
import BreakMobile from '@/components/common/break-mobile';
import PageWrapper from '@/components/common/page-wrapper';


export default function AddressPage(props: {network: string}) {
  const searchParams = useSearchParams();
  const hash = searchParams.get('hash') ?? '';
  const hashOK = isAddress(hash);

  if (hash.length !== 42)
    return <NotFoundPage reason={`Surely you're joking, right?\n
      "${hash}" is not an Ethereum address.`} />;
  else if (!hashOK) return <div>This is not a valid Ethereum address.</div>

  return (
    <main>
      {/* The min-width is applied to keep the width of the whole page constant while data reloads: */}
      <PageWrapper className='min-w-[min(65rem,_100%)]'>
        <div className='mb-8'>
          <span className='text-[1.25rem] font-bold'>Address: &nbsp;</span>
          <BreakMobile />
          <span className='font-medium'>{hash}</span>
        </div>
        <div className='flex flex-col'>
          <div className='md:min-w-[25rem]'>
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
      </PageWrapper>
    </main>
  );
}
