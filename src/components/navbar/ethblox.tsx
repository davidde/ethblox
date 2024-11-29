'use client';

import { usePathname } from 'next/navigation';


export default function EthBlox() {
  const pathname = usePathname();
  const network = pathname.split('/')[1];

  return (
    <div>
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
  );
}