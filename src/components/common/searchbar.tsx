'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input, Button } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';


export default function Searchbar(props: { className?: string }) {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const pathname = usePathname();
  const network = pathname.split('/')[1] || 'mainnet';

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm) {
      // Run only when online AND tab is visible/active:
      if (navigator.onLine && document.visibilityState === 'visible') {
        router.push(`/${network}/address?hash=${searchTerm}`);
      }
      setSearchTerm('');
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