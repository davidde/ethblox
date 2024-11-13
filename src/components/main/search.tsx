'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input, Button } from '@headlessui/react';
import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isAddress } from '@/lib/utilities';


type Props = {
  network: string
}

export default function Search(props: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();
  const query = searchParams.get('query')?.toString();


  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      if (isAddress(searchTerm)) {
        params.delete('query');
        router.push(`/address/${searchTerm}`);
      } else {
        params.set('query', searchTerm);
        router.replace(`${pathname}?${params.toString()}`);
      }
    } else {
      params.delete('query');
      router.replace(`${pathname}?${params.toString()}`);
    }
  }

  return (
    <div className='w-full md:w-[40rem] mb-4 md:mb-8'>
      <h1 className='text-xl md:text-2xl font-semibold'>
        {
          props.network === 'Ethereum Mainnet' ?
                    'The Ethereum Blockchain Explorer' :
                    'The Sepolia Testnet Explorer'
        }
      </h1>

      <form className='flex mt-3' onSubmit={handleSearch}>
        <Input
          type='text'
          placeholder='Search by Address'
          value={searchTerm || query}
          onChange={e => setSearchTerm(e.target.value.trim())}
          className='block w-full h-10 rounded-lg p-2
                     focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25
                     bg-[var(--main-bg-color)] border-2 border-[var(--border-color)]'
        />
        <Button
          type='submit'
          className='w-11 h-10 leading-8 align-middle text-center
                     rounded-lg ml-4 bg-[var(--main-bg-color)]
                     border-2 border-[var(--border-color)]'
        >
          <MagnifyingGlassIcon
            className='inline-block w-6 h-6 text-center'
          />
        </Button>
      </form>

      <span className='ml-2 md:ml-8 text-sm font-light'>
        Network: { props.network }
      </span>
    </div>
  );
}