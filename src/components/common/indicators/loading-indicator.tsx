export default function LoadingIndicator(props: { message?: string, className?: string }) {
  const chars = Array.from(props.message ?? 'Loading ...');

  return (
    <span className={`${props.className} inline-flex`}>
      {
        chars.map((char, i) =>
          <span
            key={i}
            className='italic animate-(--animate-glow)'
            style={{animationDelay: `${i * 0.1}s`}}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      }
    </span>
  );
}
