import Search from './search';
import { Suspense } from 'react';


type Props = {
  className?: string,
}

export default function Searchbar(props: Props) {
  return (
    <Suspense>
      <Search className={props.className} />
    </Suspense>
  );
}