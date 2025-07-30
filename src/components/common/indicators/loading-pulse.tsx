export default function LoadingPulse(props: { className?: string, content?: string }) {
  return ( // Set background with text-color, takes background from currentcolor!
    <span className={`${props.className} inline-block h-[1em]
                     bg-[currentcolor] animate-pulse-strong align-middle rounded-full`}>
      <span className='invisible'>
        {props.content ?? '\xa0'}
      </span>
    </span>
  );
}
