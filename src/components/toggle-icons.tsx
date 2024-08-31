"use client"

import { useState } from 'react';
import DarkmodeToggle from './darkmode-toggle';
import EthNetworkToggle from './eth-network-toggle';


export default function ToggleIcons() {
  const [darkmode, setDarkmode] = useState<boolean>(false);

  return (
    <span className='flex flex-row justify-end'>
      <DarkmodeToggle
        className='w-6 cursor-pointer hover:text-sky-300'
        darkmode={darkmode}
        setDarkmode={setDarkmode}
      />
      <EthNetworkToggle
        className='ml-5 cursor-pointer hover:invert-[0.65]'
        darkmode={darkmode}
      />
    </span>
  );
}
