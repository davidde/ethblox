import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';


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
    <Listbox>
      <ListboxButton>
        <Image
          src={ resolvedTheme === 'dark' ? '/ethereum-logo-light.svg' : '/ethereum-logo.svg' }
          width={0}
          height={0}
          alt='Ethereum Logo'
          className={props.className}
        />
      </ListboxButton>
      <ListboxOptions
        className='bg-[var(--main-bg-color)]
                   border-2 border-[var(--border-color)]
                   rounded
                   z-50'
        anchor={{ to: 'bottom end',
                  gap: '.5rem'
                }}
      >
        <ListboxOption value={``} className='m-2'>
          Ethereum Mainnet
        </ListboxOption>
        <ListboxOption value={``} className='m-2'>
          Testnet Sepolia
        </ListboxOption>
        <ListboxOption value={``} className='m-2'>
          Testnet Holesky
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  );
}
