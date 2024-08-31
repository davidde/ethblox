import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

type Props = {
  className?: string,
  darkmode: boolean,
  setDarkmode: (arg0: boolean) => void
}

export default function DarkmodeToggle(props: Props) {
  const toggleTheme = () => {
    props.setDarkmode(!props.darkmode);
    document.documentElement.classList.toggle('dark');
  }

  return (
    <button >
      {
        props.darkmode ?
        <MoonIcon className={props.className} onClick={toggleTheme} />
        :
        <SunIcon className={props.className} onClick={toggleTheme} />
      }
    </button>
  );
}
