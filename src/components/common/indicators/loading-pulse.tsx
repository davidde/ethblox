export default function LoadingPulse(props: {
  loadingPulseColor?: string, // Takes background from currentcolor by default!
  className?: string,
  content?: string
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
