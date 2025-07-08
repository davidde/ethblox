export default function LoadingIndicator() {
  const letters = ['L', 'o', 'a', 'd', 'i', 'n', 'g', '\u00A0', '.', '.', '.'];

  return (
    <ul className='flex list-none p-0 m-0'>
      {
        letters.map((char, index) =>
          <li
            key={index}
            className='italic animate-(--animate-glow)'
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {char}
          </li>
        )
      }
    </ul>
  );
}
