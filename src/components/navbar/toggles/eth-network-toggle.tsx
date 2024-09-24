import { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


type Props = {
  className?: string
}

export default function EthNetworkToggle(props: Props) {
  const [ mounted, setMounted ] = useState(false);
  const pathname = usePathname();
  const sepolia = pathname.includes('sepolia');

  // useEffect only runs on the client, so now we can safely show the UI:
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Menu>
      <MenuButton className={`${props.className} bg-[image:var(--eth-logo-url)] bg-contain bg-no-repeat bg-right`} />
      <MenuItems
        className='bg-[var(--main-bg-color)]
                   border-2 border-[var(--border-color)]
                   rounded-lg
                   z-50'
        anchor={{ to: 'bottom end',
                  gap: '.5rem'
                }}
      >
        <MenuItem
          as='div'
          className={`m-2 rounded cursor-pointer
                    data-[focus]:bg-[var(--hover-bg-color)]
                    ${sepolia ? `` : `text-[var(--hover-fg-color)]`}`}
        >
          {({ close }) => (
            <Link href='/' onClick={close}>
              Ethereum Mainnet
            </Link>
          )}
        </MenuItem>

        <MenuItem
          as='div'
          className={`m-2 rounded cursor-pointer
                    data-[focus]:bg-[var(--hover-bg-color)]
                    ${sepolia ? `text-[var(--hover-fg-color)]` : ``}`}
        >
          {({ close }) => (
            <Link href='/sepolia' onClick={close}>
              Testnet Sepolia
            </Link>
          )}
        </MenuItem>

        <MenuItem
          as='div'
          disabled={true}
          className='m-2 rounded
                    data-[disabled]:opacity-50'
        >
          Testnet Holesky
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
