import Toggles from './toggles';
import Searchbar from '../common/searchbar';
import EthBlox from './ethblox';


export default function Header() {
  return (
    <header className='sticky w-screen top-0 h-(--header-height) mb-(--content-y-margin)
      bg-(--comp-bg-color) text-(--main-fg-color) border-b border-(--border-color) z-50'>
        <nav className='flex flex-wrap justify-between items-center
                        absolute z-40 w-full py-1.5 px-2 md:px-5'
        >
          <EthBlox />

          {/* Desktop searchbar: */}
          <Searchbar className='hidden md:flex md:w-[50vw]' />

          <Toggles />

          {/* Helper component to break following flex item onto new row: */}
          <div className='basis-full md:hidden' />
          {/* Mobile searchbar: */}
          <Searchbar className='md:hidden w-full my-2' />
        </nav>
    </header>
  );
}
