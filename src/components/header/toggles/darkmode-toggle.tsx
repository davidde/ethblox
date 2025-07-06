'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";


type Props = {
  className?: string
}

export default function DarkmodeToggle(props: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [ mounted, setMounted ] = useState(false);

  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? 'ethblox';
  // Use dark eth logo on light theme, and vice versa:
  const ethLogo = resolvedTheme === 'light' ? 'ethereum-logo-dark.svg' : 'ethereum-logo-light.svg';

  // Because we cannot know the theme on the server, many of the values returned
  // from `useTheme` will be undefined until mounted on the client.
  // This means if you try to render UI based on the current theme before mounting
  // on the client, you will see a hydration mismatch error.
  // To fix this, make sure to only render UI that uses the current theme
  // when the page is mounted on the client:
  useEffect(() => {  // `useEffect` only runs on the client,
    setMounted(true); // so we can use it to safely show the UI!

    // Set the ethereum logo URL as CSS var on html:
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--eth-logo-url', `url(/${appName}/images/${ethLogo})`);
    }
  }, [ethLogo]);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    if (resolvedTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  }

  return (
    <button className={props.className} onClick={toggleTheme} >
      {
        resolvedTheme === 'dark' ?
        <SunIcon />
        :
        <MoonIcon />
      }
    </button>
  );
}
