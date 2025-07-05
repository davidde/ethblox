'use client';

import Link from 'next/link';
import GithubIcon from './icons/github-icon';
import BackToTopIcon from './icons/back-to-top-icon';
import { WrenchIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/solid';
import Copyright from './copyright';


export default function Footer() {
  return (
    <footer className='w-screen border-t border-(--border-color) bg-(--comp-bg-color) p-4 mt-12'>
      <div className='flex justify-between pb-6 border-b border-(--border-color)'>
        <Link
          href='https://github.com/davidde/ethblox'
          className='hover:text-(--hover-fg-color)'
        >
          <GithubIcon className='w-6 h-6 inline mr-2' />
          <span className='align-middle'>Source Code</span>
        </Link>
        <div
          onClick={() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
                /* you can also use 'auto' behaviour
             in place of 'smooth' */
            });
          }}
          className='hover:text-(--hover-fg-color) cursor-pointer'
        >
          <span className='align-middle'>Back to Top</span>
          <BackToTopIcon className='w-5 h-5 inline ml-1' />
        </div>
      </div>

      <div className='pt-6 text-center'>
        <div className='flex w-full justify-center'>
          <span className='w-8 h-8 bg-(image:--eth-logo-url) bg-contain bg-no-repeat bg-center' />
          <span className='text-xl font-semibold pt-1 pl-1'>
            Powered by&nbsp;
            <Link
              href='https://ethereum.org/en/'
              className='text-(--link-color) hover:text-(--hover-fg-color)'
            >
              Ethereum
            </Link>
          </span>
        </div>
        <p className='max-w-md m-auto pt-2 text-sm tracking-wider text-(--grey-fg-color)'>
          EthBlox is a Block Explorer and Analytics Platform for Ethereum,
          a decentralized smart contracts platform.
        </p>
      </div>

      <div className='flex flex-col md:flex-row w-full justify-center py-6'>
        <div>
          <div className='flex'>
            <LightBulbIcon className='w-8 h-8' />
            <span className='font-semibold pt-1 pl-1'>
              Inspired by&nbsp;
              <Link
                href='https://etherscan.io/'
                className='text-(--link-color) hover:text-(--hover-fg-color)'
              >
                Etherscan
              </Link>
            </span>
          </div>
          <p className='pl-[0.4rem] pt-1 text-xs tracking-wider text-(--grey-fg-color)'>
            The leading Ethereum Block Explorer.
          </p>
        </div>

        <div className='pt-4 md:pt-0 md:ml-40'>
          <div className='flex'>
            <WrenchIcon className='w-8 h-8' />
            <span className='font-semibold pt-1 pl-1'>
              Made with ❤️ by&nbsp;
              <Link
                href='https://github.com/davidde'
                className='text-(--link-color) hover:text-(--hover-fg-color)'
              >
                davidde
              </Link>
            </span>
          </div>
          <p className='pl-[0.4rem] pt-1 text-xs tracking-wider text-(--grey-fg-color) md:text-center'>
            Design and open-source tech lover.
          </p>
        </div>
      </div>

      <Copyright />
    </footer>
  );
}