import { Suspense } from 'react';
import Search from './search';


export default function Searchbar(props: { className?: string }) {
  return (
    <Suspense>
      <Search className={props.className} />
    </Suspense>
  );
}