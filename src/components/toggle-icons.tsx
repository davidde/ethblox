import DarkmodeToggle from './darkmode-toggle';
import EthNetworkToggle from './eth-network-toggle';

// Possible instead of the `useEffect-setMounted` combo in the Toggle components,
// disable server-side rendering here:
// import dynamic from 'next/dynamic';
// const DarkmodeToggle = dynamic(() => import('./darkmode-toggle'), {
//   ssr: false
// })
// const EthNetworkToggle = dynamic(() => import('./eth-network-toggle'), {
//   ssr: false
// })

export default function ToggleIcons() {
  return (
    <span className='flex flex-row justify-end'>
      <DarkmodeToggle
        className='w-6 cursor-pointer hover:text-[var(--hover-color)]'
      />
      <EthNetworkToggle
        className='ml-5 h-6 w-auto cursor-pointer hover:invert-[0.65]'
      />
    </span>
  );
}
