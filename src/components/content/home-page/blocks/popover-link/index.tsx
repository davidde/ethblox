'use client';

import Link from 'next/link';
import { useState } from 'react';
import Popover from './popover';


type Props = {
  href: string,
  content: string,
  popover?: string,
  leftPosition?: string
}

export default function PopoverLink(props: Props) {
  const [show, setShow] = useState(false);

  const handleMouseEnter = () => {
    setShow(true);
  }

  const handleMouseLeave = () => {
    setShow(false);
  }

  const leftPosition = props.leftPosition ?? 'left-[-42%]';
  console.log('leftPosition = ', leftPosition);

  return (
    <Link
      href={props.href}
      className='relative w-40 h-8 text-sky-600 dark:text-blue-300 hover:text-[var(--hover-fg-color)] dark:hover:text-[var(--inverse-bg-color-lighter)]'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {
        !props.popover ? '' :
          <Popover
            className={`${show ? 'inline' : 'hidden'} ${leftPosition} top-[-2.6rem]`}
            content={props.popover}
          />
        }
      <span>
        {props.content}
      </span>
    </Link>
  );
}