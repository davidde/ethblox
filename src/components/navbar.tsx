"use client";

import { useState } from 'react';
import { Bars3Icon } from "@heroicons/react/24/solid";


function Navbar() {
  const [isOpen, setisOpen] = useState(false);

  const toggleOpen = () => {
    setisOpen(!isOpen);
  };

  return (
    <div className={`inline`}>
      <header className={`sticky top-0 z-50`}>
        <nav className={`bg-blue-950 py-2.5 px-5 flex justify-between items-center gap-10 min-h-16`}>

          <a href='#home' className={`text-3xl font-sans`}>EthBlox</a>

          <ul className={`flex justify-between items-center text-start bg-blue-950` +
                         ` m-0 py-4 ease-in-out duration-500` +
                         // Mobile-only classes:
                         ` absolute flex-col gap-4 w-full -top-28 left-0 -z-10` +
                         // Desktop-only classes:
                         ` md:static md:flex-row md:gap-16 md:w-auto md:transform-none md:z-10` +
                         `${isOpen ? ' translate-y-full' : ' -translate-y-full'}`}>
            <li>
              <a href='#home'>Home</a>
            </li>
            <li>
              <a href='#home'>Catalog</a>
            </li>
            <li>
              <a href='#home'>Products</a>
            </li>
            <li>
              <a href='#home'>Contact</a>
            </li>
          </ul>

          <div>
            <Bars3Icon className="w-6 cursor-pointer md:hidden" onClick={toggleOpen} />
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Navbar;