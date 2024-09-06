import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect, useContext } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { NetworkContext } from "@/components/context-provider";


type Props = {
  className?: string
}

export default function EthNetworkToggle(props: Props) {
  const { resolvedTheme } = useTheme();
  const [ mounted, setMounted ] = useState(false);
  const { network, setNetwork } = useContext(NetworkContext);

  // useEffect only runs on the client, so now we can safely show the UI:
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Listbox value={network} onChange={setNetwork}>
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
        <ListboxOption
          value='Ethereum Mainnet'
          className='m-2 rounded cursor-pointer
                    data-[focus]:bg-[var(--hover-bg-color)]
                    data-[selected]:text-[var(--hover-fg-color)]'
        >
          Ethereum Mainnet
        </ListboxOption>

        <ListboxOption
          value='Testnet Sepolia'
          className='m-2 rounded cursor-pointer
                    data-[focus]:bg-[var(--hover-bg-color)]
                    data-[selected]:text-[var(--hover-fg-color)]'
        >
          Testnet Sepolia
        </ListboxOption>

        <ListboxOption
          value='Testnet Holesky'
          disabled={true}
          className='m-2 rounded
                    data-[disabled]:opacity-50'
        >
          Testnet Holesky
        </ListboxOption>
      </ListboxOptions>
    </Listbox>
  );
}
