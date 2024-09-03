import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';


type Props = {
  className?: string
}

export default function EthNetworkToggle(props: Props) {
  const { resolvedTheme } = useTheme();
  const [ mounted, setMounted ] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI:
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Image
          src={ resolvedTheme === 'dark' ? '/ethereum-logo-light.svg' : '/ethereum-logo.svg' }
          width={0}
          height={0}
          alt='Ethereum Logo'
          className={props.className}
      />
  );
}
