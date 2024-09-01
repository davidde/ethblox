'use client';

import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';
import DropdownLi from './dropdown-li';
import ToggleIcons from './toggle-icons';


type Props = {
  colorClass: string
}

export default function Navbar(props: Props) {
  const [isOpen, setisOpen] = useState(false);
  const [darkmode, setDarkmode] = useState<boolean>(false);

  const toggleOpen = () => {
    setisOpen(!isOpen);
  };

  return (
    <div className={`inline`}>
      <header className={`sticky top-0 z-50 border-b border-slate-200 dark:border-stone-900`}>
        <nav className={`${props.colorClass}` +
                        ` py-2.5 px-5 flex justify-between items-center gap-10 min-h-16`}>

          <a href='#home' className={`text-3xl font-mono`}>EthBlox</a>

          {/* Responsive list, horizontal on desktop, vertical on mobile: */}
          <ul className={`${props.colorClass}` +
                         ` flex justify-between text-start` +
                         ` m-0 py-4 px-14 ease-in-out duration-500` +
                         // Mobile-only classes:
                         ` absolute flex-col gap-4 w-full left-0 -z-10` +
                         // Desktop-only classes:
                         ` md:static md:flex-row md:gap-12 md:w-auto md:z-10` +
                         `${isOpen ? ' top-16' : ' -top-96'}`}>
            {/* Show on mobile, not desktop: */}
            <li className='md:hidden pb-5'>
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

          <div>
            {/* Show on desktop, not mobile: */}
            <span className='hidden md:inline'>
              <ToggleIcons
                darkmode={darkmode}
                setDarkmode={setDarkmode}
              />
            </span>
            {/* Show on mobile, not desktop: */}
            <Bars3Icon className='w-6 cursor-pointer md:hidden' onClick={toggleOpen} />
          </div>
        </nav>
      </header>
    </div>
  );
}
