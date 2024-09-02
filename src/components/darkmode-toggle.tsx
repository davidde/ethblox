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
    if (localStorage.getItem('data-theme-dark')) {
      props.setDarkmode(true);
      document.documentElement.setAttribute('data-theme-dark', '');
      document.documentElement.classList.add('dark');
    }
  });

  const toggleTheme = () => {
    if (document.documentElement.hasAttribute('data-theme-dark')) {
      props.setDarkmode(false);
      document.documentElement.removeAttribute('data-theme-dark');
      document.documentElement.classList.remove('dark');
      localStorage.removeItem('data-theme-dark');
    } else {
      props.setDarkmode(true);
      document.documentElement.setAttribute('data-theme-dark', '');
      document.documentElement.classList.add('dark');
      localStorage.setItem('data-theme-dark', 'true');
    }
  }

  // This log somehow prevents light/dark mode from flickering on reload:
  console.log('data-theme-dark = ', document.documentElement.hasAttribute('data-theme-dark'));

  return (
    <button className={props.className} onClick={toggleTheme} >
      {
        props.darkmode ?
        <MoonIcon />
        :
        <SunIcon />
      }
    </button>
  );
}
