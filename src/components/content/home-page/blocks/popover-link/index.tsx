'use client';

import Link from 'next/link';
import { useState } from 'react';
import Popover from './popover';


type Props = {
  href: string,
  content: string,
  popover?: string,
  percentToLeft?: string
}

export default function PopoverLink(props: Props) {
  const [show, setShow] = useState(false);

  return (
    <Link
      href={props.href}
      className='relative w-40 h-8 text-sky-600 dark:text-blue-300 hover:text-[var(--hover-fg-color)] dark:hover:text-[var(--inverse-bg-color-lighter)]'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {
        !props.popover ? '' :
          <Popover
            className={`${show ? 'inline' : 'hidden'} -left-[${props.percentToLeft ?? 42}%] top-[-2.6rem]`}
            content={props.popover}
          />
        }
      <span>
        {props.content}
      </span>
    </Link>
  );
}