import { Suspense } from 'react';
import Search from './search';
import SearchSkeleton from './search-skeleton';


export default function Searchbar(props: { className?: string }) {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <Search className={props.className} />
    </Suspense>
  );
}