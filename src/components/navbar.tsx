'use client';

import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import DropdownLi from './dropdown-li';
import ToggleIcons from './toggle-icons';


export default function Navbar() {
  const [isOpen, setisOpen] = useState(false); // Mobile only!
  const [darkmode, setDarkmode] = useState<boolean>(false);

  const toggleOpen = () => {
    setisOpen(!isOpen);
  };

  return (
    <section className={`inline`}>
      <div className={`sticky top-0 z-50`}>
        <nav className={`bg-[var(--main-bg-color)] text-[var(--main-fg-color)]` +
                        ` border-b border-[var(--border-color)]` +
                        ` flex justify-between items-center gap-10` +
                        ` absolute z-40 w-full py-2.5 px-5 min-h-16`
        }>
          <a href='#home' className={`text-3xl font-mono`}>EthBlox</a>

          {/* Responsive horizontal list desktop-only: */}
          <ul className={` hidden justify-between text-start` +
                         ` m-0 py-4 px-14 ease-in-out duration-500` +
                         ` md:flex md:static md:flex-row md:gap-12 md:w-auto md:z-10`
          }>
            <DropdownLi href='#home' title='Blockchain' />
            <DropdownLi href='#home' title='Tokens' />
            <DropdownLi href='#home' title='NFTs' />
            <DropdownLi href='#home' title='Resources' />
          </ul>

          <div>
            {/* Show on desktop, not mobile: */}
            <span className='hidden md:inline'>
              <ToggleIcons
                darkmode={darkmode}
                setDarkmode={setDarkmode}
              />
            </span>
            {/* Show on mobile, not desktop: */}
            <Bars3Icon className='w-6 cursor-pointer hover:text-[var(--hover-color)] md:hidden' onClick={toggleOpen} />
          </div>
        </nav>

        {/* Responsive vertical list mobile-only: */}
        <nav className={`bg-[var(--main-bg-color)] text-[var(--main-fg-color)]` +
                        ` border-b border-[var(--border-color)]` +
                        ` md:hidden absolute w-full left-0` +
                        ` transition-[top] ease-in-out duration-500` +
                        `${isOpen ? ' top-16' : ' -top-96'}`} >
          <ul className={` flex flex-col gap-4 justify-between text-start` +
                        ` m-0 py-4 px-14`}>
            <li className='pb-5'>
              <ToggleIcons
                darkmode={darkmode}
                setDarkmode={setDarkmode}
              />
            </li>
            <DropdownLi href='#home' title='Blockchain' />
            <DropdownLi href='#home' title='Tokens' />
            <DropdownLi href='#home' title='NFTs' />
            <DropdownLi href='#home' title='Resources' />
          </ul>
        </nav>
      </div>
    </section>
  );
}
