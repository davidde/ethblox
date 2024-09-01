import Image from 'next/image';

type Props = {
  className?: string,
  darkmode: boolean
}

export default function EthNetworkToggle(props: Props) {
  return (
    <Image
          src={`${ props.darkmode ? '/ethereum-logo-light.svg' : '/ethereum-logo.svg' }`}
          width={16}
          height={16}
          alt='Ethereum Logo'
          className={props.className}
      />
  );
}
