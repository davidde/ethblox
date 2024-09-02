'use client';

import { useEffect } from 'react';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";


type Props = {
  className?: string,
  darkmode: boolean,
  setDarkmode: (arg0: boolean) => void
}

export default function DarkmodeToggle(props: Props) {
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      props.setDarkmode(true);
      document.documentElement.classList.add('dark');
    }
  });

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      props.setDarkmode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      props.setDarkmode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  return (
    <button >
      {
        props.darkmode ?
        <MoonIcon className={props.className} onClick={toggleTheme} />
        :
        <SunIcon className={props.className} onClick={toggleTheme} />
      }
    </button>
  );
}
