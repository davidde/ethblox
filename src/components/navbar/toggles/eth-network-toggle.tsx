import { useState, useEffect, useContext } from 'react';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { NetworkContext } from "@/components/context-provider";


type Props = {
  className?: string
}

export default function EthNetworkToggle(props: Props) {
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
      <ListboxButton className={`${props.className} bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-right`} />
      <ListboxOptions
        className='bg-[var(--main-bg-color)]
                   border-2 border-[var(--border-color)]
                   rounded-lg
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
