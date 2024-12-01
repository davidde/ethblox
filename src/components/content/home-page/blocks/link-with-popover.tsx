'use client';

import Link from 'next/link';
import { useState } from 'react';
import SpeechBubble from './speech-bubble';


type Props = {
  href: string,
  content: string,
  popover?: string,
}

export default function LinkWithPopover(props: Props) {
  const [show, setShow] = useState(false);

  return (
    <Link
      href={props.href}
      className='relative text-sky-600 dark:text-blue-300 hover:text-[var(--hover-fg-color)] dark:hover:text-[var(--inverse-bg-color-lighter)]'
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {
        !props.popover ? '' :
          <SpeechBubble
            className={`${show ? 'inline' : 'hidden'}`}
            content={props.popover}
          />
        }
      <span>
        {props.content}
      </span>
    </Link>
  );
}