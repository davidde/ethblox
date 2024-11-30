import Toggles from './toggles';
import Searchbar from '@/components/searchbar';
import EthBlox from './ethblox';


export default function Header() {
  return (
    <section className='w-screen h-36 md:h-24 sticky top-0 z-50'>
        <nav className={`bg-[var(--main-bg-color)] text-[var(--main-fg-color)]` +
                        ` border-b border-[var(--border-color)]` +
                        ` flex flex-wrap justify-between items-center` +
                        ` absolute z-40 w-full py-1.5 px-2 md:px-5 min-h-16`
        }>
          <EthBlox />

          {/* Desktop searchbar: */}
          <Searchbar className='hidden md:flex md:w-[50vw]' />

          <Toggles />

          {/* Helper component to break following flex item onto new row: */}
          <div className='basis-full md:hidden' />
          {/* Mobile searchbar: */}
          <Searchbar className='md:hidden w-full my-2' />
        </nav>
    </section>
  );
}
