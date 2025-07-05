'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input, Button } from '@headlessui/react';
import { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { isAddress } from '@/lib/utilities';


type Props = {
  className?: string,
}

export default function Search(props: Props) {
  // Read the current URL's query string:
  const searchParams = useSearchParams(); // returns a read-only version of the URLSearchParams interface
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString());

  const pathname = usePathname();
  const network = pathname.split('/')[1];

  const router = useRouter();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create URLSearchParams object to access utility methods to work with the query string of a URL:
    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      if (isAddress(searchTerm)) {
        params.delete('query');
        if (navigator.onLine && document.visibilityState === 'visible') {
          router.push(`/${network}/address/${searchTerm}`);
        }
        setSearchTerm('');
      } else {
        params.set('query', searchTerm);
        if (navigator.onLine && document.visibilityState === 'visible') {
          router.replace(`${pathname}?${params.toString()}`);
        }
      }
    } else {
      params.delete('query');
      if (navigator.onLine && document.visibilityState === 'visible') {
        router.replace(`${pathname}`);
      }
    }
  }

  return (
    <form className={`flex ${props.className}`} onSubmit={handleSearch}>
      <Input
        type='text'
        placeholder='Search by Address'
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value.trim())}
        className='block w-full h-10 rounded-lg p-2
                    focus:outline-hidden data-focus:outline-2 data-focus:-outline-offset-2
                    data-focus:outline-(--link-color) bg-(--main-bg-color)
                    border-2 border-(--border-color) dark:placeholder-[#364236]'
      />
      <Button
        type='submit'
        className='w-11 h-10 leading-8 align-middle text-center rounded-lg ml-4
                   bg-(--link-color) dark:bg-(--hover-bg-color) hover:bg-(--hover-fg-color)
                   text-(--main-bg-color) dark:text-(--hover-fg-color) hover:text-white'
      >
        <MagnifyingGlassIcon
          className='inline-block w-6 h-6 text-center'
        />
      </Button>
    </form>
  );
}