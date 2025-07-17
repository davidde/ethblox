import { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { OwnedToken } from 'alchemy-sdk';


export function TokenDropdown(props: { tokens: OwnedToken[]} ) {
return (
    <Menu as='div' className='relative inline-block text-left'>
      <MenuButton className='relative z-20 w-[15rem] inline-flex items-center justify-between rounded-md
          bg-(--card-bg-color) text-(--main-fg-color) px-3 py-1.5 text-sm/6 font-medium
          border border-(--border-color) shadow-inner shadow-black/15 dark:shadow-white/10
          hover:bg-(--banner-bg-color) data-open:bg-(--banner-bg-color) cursor-pointer'>
        {props.tokens.length} Tokens
        <ChevronDownIcon className='size-4' />
      </MenuButton>
      <Transition
        as={Fragment} // Using Fragment ensures no extra DOM node is rendered for Transition itself
        enter='transition ease-in-out duration-200'
        enterFrom='transform opacity-0 scale-50'
        enterTo='transform opacity-100 scale-100'
        leave='transition ease-in duration-150'
        leaveFrom='transform opacity-100 scale-100'
        leaveTo='transform opacity-0 scale-50'
      >
        <MenuItems className='absolute left-0 origin-top z-10 overflow-auto w-fit
          mt-2 max-h-[23rem] min-w-[15rem] max-w-[25rem] rounded-md shadow-black/40 dark:shadow-white/5
          shadow-2xl ring-1 ring-(--border-color) bg-(--comp-bg-color) text-(--main-fg-color)
          flex flex-col divide-y divide-(--border-color)/60'>
          {
            props.tokens.map((token) => {
              // All token fileds are guaranteed to exist because of the filter in Tokens `useEffect()`:
              const bal = parseFloat(token.balance!); // so non-null assertion allowed!
              const isZero = bal === 0;
              let balance = bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
              balance = !isZero && balance === '0.00' ? '~0.00' : balance;

              return (
                <MenuItem key={token.contractAddress}>
                  <div tabIndex={0}
                      title={`Contract address: ${token.contractAddress}`}
                      className='cursor-default px-3 py-2 rounded
                      hover:bg-(--banner-bg-color) hover:text-blue-900'>
                    <div className='flex flex-col'>
                      <div className='inline-flex items-center justify-between gap-[2rem]'>
                        <span className='font-semibold'>{token.symbol}</span>
                        <span className='text-(--grey-fg-color) text-sm'>{balance}</span>
                      </div>
                      <span>{token.name}</span>
                    </div>
                  </div>
                </MenuItem>
              );
            })
          }
        </MenuItems>
      </Transition>
    </Menu>
  );
}