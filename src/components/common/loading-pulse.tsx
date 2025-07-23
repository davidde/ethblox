export default function LoadingPulse(props: { className: string }) {
  return ( // Requires className to set background color
    <span className={`${props.className} animate-pulse-strong inline-block align-middle rounded-full h-[1em]`}>
      &nbsp;
    </span>
  );
}
