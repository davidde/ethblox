'use client';

import { ChartBarIcon } from '@heroicons/react/24/outline';
import GastrackerCard from './gastracker-card';
import BreakMobile from '@/components/common/break-mobile';
import PageWrapper from '@/components/common/page-wrapper';
import { useDataState } from '@/lib/data-state';


export default function GastrackerPage() {
  const pricesData = useDataState<any>({
    fetcher: (url) => fetch(url),
    args: ['https://eth.blockscout.com/api/v2/stats'],
  });

  return (
    <main>
      {/* The min-width is applied to keep the width of the whole page constant while data reloads: */}
      <PageWrapper className='min-w-[min(62rem,_100%)]'>
        <div className='flex flex-col items-center'>
          <div className='w-full md:w-[85%] flex flex-col md:flex-row justify-between items-center
                          my-5 md:my-10 mx-auto p-1 md:py-5 md:px-3 bg-(--card-bg-color)
                          rounded-lg shadow-lg ring-1 ring-(--border-color) ring-opacity-5'>
            <ChartBarIcon className='w-8 h-8 text-(--grey-fg-color)/80 self-start' />
            <p className='text-3xl text-(--grey-fg-color)/80 italic font-medium
              tracking-wide wordsp-[0.8em] md:mx-[1.6em] content-center'>
              ETHEREUM <BreakMobile />GAS TRACKER
            </p>
            <ChartBarIcon className='w-8 h-8 text-(--grey-fg-color)/80 scale-x-[-1] self-end' />
          </div>

          <div className='flex flex-col md:flex-row items-start
            justify-between ml-auto mr-auto w-full max-w-200 my-10'>
            <GastrackerCard title='Low' pricesData={pricesData} />
            <GastrackerCard title='Average' pricesData={pricesData} />
            <GastrackerCard title='High' pricesData={pricesData} />
          </div>
        </div>
      </PageWrapper >
    </main>
  );
}
