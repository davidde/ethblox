'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';


export default function EthBlox() {
  const pathname = usePathname();
  const network = pathname.split('/')[1];

  return (
    <div>
      <Link
        href='/mainnet'
        className='text-3xl font-mono hover:text-[var(--hover-fg-color)]'
      >
        ΞthBlox
      </Link>
      <p className='pl-[2.5rem] mt-[-0.6rem] text-lg font-mono tracking-wider text-[var(--grey-fg-color)]'>
        {network}
      </p>
    </div>
  );
}