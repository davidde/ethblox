"use client"

import { useState } from 'react';
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

type Props = {
  className?: string
}

export default function DarkModeToggle(props: Props) {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  return (
    <button >
      {
        darkMode ?
        <MoonIcon className={props.className} />
        :
        <SunIcon className={props.className} />
      }
    </button>
  );
}
