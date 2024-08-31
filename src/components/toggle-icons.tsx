import DarkModeToggle from './darkmode-toggle';
import Image from 'next/image';


export default function ToggleIcons() {
  return (
    <span className='flex flex-row justify-end'>
      <DarkModeToggle className='w-6 cursor-pointer hover:text-sky-300' />
      <Image
          src='/ethereum-logo-light.svg'
          width={16}
          height={16}
          alt='Ethereum Logo'
          className='ml-5 cursor-pointer hover:invert-[0.65]'
      />
    </span>
  );
}
