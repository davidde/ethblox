'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input, Button } from '@headlessui/react';
import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isAddress } from '@/lib/utilities';


type Props = {
  className?: string,
}

export default function Searchbar(props: Props) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query') ?? '');

  const pathname = usePathname();
  const network = pathname.split('/')[1];
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      if (isAddress(searchTerm)) {
        params.delete('query');
        router.push(`/${network}/address/${searchTerm}`);
        setSearchTerm('');
      } else {
        params.set('query', searchTerm);
        router.replace(`${pathname}?${params.toString()}`);
      }
    } else {
      params.delete('query');
      router.replace(`${pathname}`);
    }
  }

  return (
    <form className={`${props.className} flex`} onSubmit={handleSearch}>
      <Input
        type='text'
        placeholder='Search by Address'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value.trim())}
        className='block w-full h-10 rounded-lg p-2
                    focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25
                    bg-[var(--main-bg-color)] border-2 border-[var(--border-color)]'
      />
      <Button
        type='submit'
        className='w-11 h-10 leading-8 align-middle text-center rounded-lg ml-4
                    bg-[var(--border-color)] hover:bg-[var(--hover-fg-color)] text-[var(--main-bg-color)]'
      >
        <MagnifyingGlassIcon
          className='inline-block w-6 h-6 text-center'
        />
      </Button>
    </form>
  );
}