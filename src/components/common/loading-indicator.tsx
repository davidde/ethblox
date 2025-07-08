export default function LoadingIndicator() {
  const letters = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '\u00A0', '.', '.', '.'];

  return (
    <span className='inline-flex p-0 m-0'>
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
