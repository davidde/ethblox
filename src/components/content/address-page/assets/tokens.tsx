'use client';

import { useState, useEffect, Fragment } from 'react';
import ValueDisplay from '@/components/common/value-display';
import { getAlchemy } from '@/lib/utilities';
import { OwnedToken } from 'alchemy-sdk';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';


export default function Tokens(props: {
  hash: string,
  network: string
}) {
  const alchemy = getAlchemy(props.network);
  const [tokens, setTokens] = useState<OwnedToken[]>();
  const [tokensError, setTokensError] = useState<string>();

  useEffect(() => {
    if (props.network === 'mainnet') (async () => {
      try {
        const resp = await alchemy.core.getTokensForOwner(props.hash);
        // Remove scam tokens; everything without name/logo/symbol or zero balance:
        let filteredTokens = resp.tokens.filter(token =>
          token.name && token.logo && token.symbol && token.balance &&
          !(token.balance.startsWith('0') && token.balance.endsWith('0')));
        // Sort tokens alphabetically by symbol:
        filteredTokens.sort((a, b) => a.symbol!.localeCompare(b.symbol!));
        setTokens(filteredTokens);
      } catch(err) {
        const error = 'AddressPage Tokens getTokensForOwner() ' + err;
        console.error(error);
        setTokensError(error);
      }
    })();
  }, [alchemy, props.hash]);

  function getTokenList(tokens: OwnedToken[]) {
    return tokens.map((token) => {
      const bal = parseFloat(token.balance!);
      const isZero = bal === 0;
      let balance = bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 });
      balance = !isZero && balance === '0.00' ? '~0.00' : balance;

      return ({ // We can use non-null assertion since we filtered out null
        name: token.name!, // and undefined values in useEffect() above!
        symbol: token.symbol!,
        balance: balance,
        address: token.contractAddress,
      })
    });
  }

  function TokenDropdown(ownedTokens?: OwnedToken[]) {
    if (!ownedTokens) return undefined;
    if (ownedTokens && ownedTokens.length === 0) return '/';
    let tokens = getTokenList(ownedTokens);

    return (
      <Menu as='div' className='relative inline-block text-left'>
        <MenuButton className='relative z-20 w-[15rem] inline-flex items-center justify-between rounded-md
            bg-(--card-bg-color) text-(--main-fg-color) px-3 py-1.5 text-sm/6 font-medium
            border border-(--border-color) shadow-inner shadow-black/15 dark:shadow-white/10
            hover:bg-(--banner-bg-color) data-open:bg-(--banner-bg-color) cursor-pointer'>
          {tokens.length} Tokens
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
          <MenuItems className='absolute left-0 origin-top z-10 overflow-auto
            mt-2 max-h-[23rem] min-w-[15rem] max-w-[25rem] rounded-md shadow-black/40 dark:shadow-white/5
            shadow-2xl ring-1 ring-(--border-color) bg-(--comp-bg-color) text-(--main-fg-color)
            flex flex-col divide-y divide-(--border-color)/60'>
              {tokens.map((token) => (
                <MenuItem key={token.address}>
                  <div tabIndex={0}
                      title={`Contract address: ${token.address}`}
                      className='cursor-default px-3 py-2 rounded
                      hover:bg-(--banner-bg-color) hover:text-blue-900'>
                    <div className='flex flex-col'>
                      <div className='inline-flex items-center justify-between gap-[2rem]'>
                        <span className='font-semibold'>{token.symbol}</span>
                        <span className='text-(--grey-fg-color) text-sm'>{token.balance}</span>
                      </div>
                      <span>{token.name}</span>
                    </div>
                  </div>
                </MenuItem>
              ))}
          </MenuItems>
        </Transition>
      </Menu>
    );
  }


  return (
    <div>
      <h2 className='capsTitle'>TOKEN HOLDINGS</h2>
      <ValueDisplay
        value={TokenDropdown(tokens)}
        error={tokensError}
        err='Error getting tokens'
      />
    </div>
  );
}