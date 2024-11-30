import Link from 'next/link';


type Props = {
  href: string,
  content: string,
  popover?: string,
}

export default function LinkWithPopover(props: Props) {
  return (
    <Link href={props.href} className='text-[var(--link-fg-color)] hover:text-[var(--hover-fg-color)]'>
      {props.content}
    </Link>
  );
}