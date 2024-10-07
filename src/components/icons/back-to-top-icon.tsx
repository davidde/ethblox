type Props = {
  className: string
}

export default function BackToTopIcon(props: Props) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={props.className}
      width='800'
      height='800'
      viewBox='0 0 48 48'
      fill='none'
    >
      <path d='M24.0083 14.1005V42' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>
      <path d='M12 26L24 14L36 26' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>
      <path d='M12 6H36' stroke='currentColor' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/>
    </svg>
  );
}