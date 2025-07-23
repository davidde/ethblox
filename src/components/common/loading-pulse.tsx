export default function LoadingPulse(props: { className: string, content?: string, }) {
  return ( // Requires className to set background color as well as width!
    <span className={`${props.className} animate-pulse-strong inline-block align-middle rounded-full h-[1em]`}>
      <span className='invisible'>
        {props.content ?? ' '}
      </span>
    </span>
  );
}
