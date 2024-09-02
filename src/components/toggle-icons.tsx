import DarkmodeToggle from './darkmode-toggle';
import EthNetworkToggle from './eth-network-toggle';


type Props = {
  darkmode: boolean,
  setDarkmode: (arg0: boolean) => void
}

export default function ToggleIcons(props: Props) {
  return (
    <span className='flex flex-row justify-end'>
      <DarkmodeToggle
        className='w-6 cursor-pointer hover:text-[var(--hover-color)]'
        darkmode={props.darkmode}
        setDarkmode={props.setDarkmode}
      />
      <EthNetworkToggle
        className='ml-5 cursor-pointer hover:invert-[0.65]'
        darkmode={props.darkmode}
      />
    </span>
  );
}
