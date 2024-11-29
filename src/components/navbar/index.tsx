'use client';

import Toggles from './toggles';
import Searchbar from '@/components/searchbar';
import { usePathname } from 'next/navigation';


export default function Navbar() {
  const pathname = usePathname();
  const network = pathname.split('/')[1];

  return (
    <section className='w-screen h-36 md:h-24 sticky top-0 z-50'>
        <nav className={`bg-[var(--main-bg-color)] text-[var(--main-fg-color)]` +
                        ` border-b border-[var(--border-color)]` +
                        ` flex flex-wrap justify-between items-center` +
                        ` absolute z-40 w-full py-1.5 px-2 md:px-5 min-h-16`
        }>
          <div className=''>
            <a
              href='/mainnet'
              className='text-3xl font-mono hover:text-[var(--hover-fg-color)]'
            >
              ΞthBlox
            </a>
            <p className='pl-[2.5rem] mt-[-0.6rem] text-lg font-mono tracking-wider text-[var(--grey-fg-color)]'>
              {network}
            </p>
          </div>

          {/* Desktop searchbar: */}
          <Searchbar className='hidden md:flex md:w-[40rem]' />

          <Toggles />

          {/* Helper component to break following flex item onto new row: */}
          <div className='basis-full md:hidden' />
          {/* Mobile searchbar: */}
          <Searchbar className='md:hidden w-full my-2' />
        </nav>
    </section>
  );
}
