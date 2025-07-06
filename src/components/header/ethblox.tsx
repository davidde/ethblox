'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';


export default function EthBlox() {
  const pathname = usePathname();
  const network = pathname.split('/')[1] || 'mainnet';

  return (
    <div>
      <Link
        href='/'
        className='bg-linear-to-r from-(--gradient-from-color) via-(--gradient-via-color) to-(--gradient-to-color)
                   bg-clip-text text-transparent text-3xl font-mono font-bold hover:text-(--hover-fg-color)'
      >
        ΞthBlox
      </Link>
      <p className='pl-10 mt-[-0.6rem] text-lg font-mono tracking-wider text-(--grey-fg-color)'>
        {network}
      </p>
    </div>
  );
}