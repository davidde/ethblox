export default function LoadingIndicator(props: { className?: string }) {
  const letters = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '\u00A0', '.', '.', '.'];

  return (
    <span className={`${props.className} inline-flex`}>
      {
        letters.map((char, index) =>
          <span
            key={index}
            className='italic animate-(--animate-glow)'
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {char}
          </span>
        )
      }
    </span>
  );
}
