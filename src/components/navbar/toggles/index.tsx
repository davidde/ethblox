import DarkmodeToggle from './darkmode-toggle';
import EthNetworkToggle from './eth-network-toggle';


export default function Toggles() {
  return (
    <span className='flex flex-row justify-end min-w-[4.5rem]'>
      <DarkmodeToggle
        className='w-6 min-w-6 cursor-pointer hover:text-[var(--hover-fg-color)]'
      />
      <EthNetworkToggle
        className='w-6 h-6 ml-5 cursor-pointer hover:invert-[0.65]'
      />
    </span>
  );
}
