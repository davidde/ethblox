'use client';

import { useState } from 'react';
import Link from 'next/link';
import Popover from './popover';


export default function PopoverLink(props: {
  href: string,
  content: string,
  popover: string,
  className?: string
}) {
  const [show, setShow] = useState(false);

  return (
    <Link
      href={props.href}
      className='relative font-mono w-40 h-8 text-(--link-color) hover:text-(--hover-fg-color)'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Popover
        className={`${show ? 'block' : 'hidden'} ${props.className ?? ''}`}
        content={props.popover}
      />
      <span>
        {props.content}
      </span>
    </Link>
  );
}