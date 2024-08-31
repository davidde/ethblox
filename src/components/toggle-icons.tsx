import DarkModeToggle from './darkmode-toggle';
import Image from 'next/image';


export default function ToggleIcons() {
  return (
    <span className='flex flex-row justify-end'>
      <DarkModeToggle className='w-6 cursor-pointer' />
      <Image
          src='/ethereum-logo-light.svg'
          width={16}
          height={16}
          alt='Ethereum Logo'
          className='ml-5 cursor-pointer'
      />
    </span>
  );
}
