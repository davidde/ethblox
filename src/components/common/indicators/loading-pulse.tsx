import { ReactNode } from 'react';


export default function LoadingPulse(props: {
  loadingPulseColor?: string, // Takes background color from currentcolor (i.e. text color) by default!
  content?: ReactNode // `content` is just used to determine width, but not actually displayed!
  className?: string,
}) {
  const color = props.loadingPulseColor ?? 'bg-[currentcolor]';

  return (
    <span className={`${props.className} ${color} inline-block h-[1em]
                    animate-pulse-strong align-middle rounded-full`}>
      <span className='invisible'>
        {props.content ?? '\xa0'}
      </span>
    </span>
  );
}
