'use client';

import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import DropdownLi from './dropdown-li';
import ToggleIcons from './toggle-icons';


export default function Navbar() {
  const [isOpen, setisOpen] = useState(false);

  const toggleOpen = () => {
    setisOpen(!isOpen);
  };

  return (
    <div className={`inline`}>
      <header className={`sticky top-0 z-50`}>
        <nav className={`bg-blue-950 py-2.5 px-5 flex justify-between items-center gap-10 min-h-16`}>

          <a href='#home' className={`text-3xl font-sans`}>EthBlox</a>

          {/* Responsive list, horizontal on desktop, vertical on mobile: */}
          <ul className={`flex justify-between text-start bg-blue-950` +
                         ` m-0 py-4 px-14 ease-in-out duration-500` +
                         // Mobile-only classes:
                         ` absolute flex-col gap-4 w-full top-16 left-0 -z-10` +
                         // Desktop-only classes:
                         ` md:static md:flex-row md:gap-16 md:w-auto md:transform-none md:z-10` +
                         `${isOpen ? '' : ' -translate-y-full'}`}>
            {/* Show on mobile, not desktop: */}
            <li className='md:hidden pb-5'>
              <ToggleIcons />
            </li>
            <DropdownLi href='#home' title='Blockchain' />
            <DropdownLi href='#home' title='Tokens' />
            <DropdownLi href='#home' title='NFTs' />
            <DropdownLi href='#home' title='Resources' />
          </ul>

          <div>
            {/* Show on desktop, not mobile: */}
            <span className='hidden md:inline'>
              <ToggleIcons />
            </span>
            {/* Show on mobile, not desktop: */}
            <Bars3Icon className='w-6 cursor-pointer md:hidden' onClick={toggleOpen} />
          </div>
        </nav>
      </header>
    </div>
  );
}
