'use client';

import Link from 'next/link';
import { useState } from 'react';
import Popover from './popover';


type Props = {
  href: string,
  content: string,
  popover: string,
  className?: string
}

export default function PopoverLink(props: Props) {
  const [show, setShow] = useState(false);
  const handleMouseEnter = () => setShow(true);
  const handleMouseLeave = () => setShow(false);

  return (
    <Link
      href={props.href}
      className='relative font-mono w-40 h-8 text-[var(--link-color)] hover:text-[var(--hover-fg-color)]'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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