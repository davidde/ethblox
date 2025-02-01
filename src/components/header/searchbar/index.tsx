import Search from './search';
import { Suspense } from 'react';
import SearchSkeleton from './search-skeleton';


type Props = {
  className?: string,
}

export default function Searchbar(props: Props) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <Search className={props.className} />
    </Suspense>
  );
}