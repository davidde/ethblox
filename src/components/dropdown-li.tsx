import { ChevronDownIcon } from "@heroicons/react/24/solid";


type Props = {
  title: string,
  href: string
}

export default function DropdownLi(props: Props) {

  return (
    <li>
      <a className="flex flex-row justify-between hover:text-sky-300" href={props.href}>
        <p>{props.title}</p>
        <ChevronDownIcon className="w-5 pl-1 py-1 box-border" />
      </a>
    </li>
  );
}
