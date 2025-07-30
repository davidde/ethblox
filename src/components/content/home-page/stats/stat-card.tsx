import { ReactNode } from 'react';
import { DataState } from '@/lib/data-state';
import ErrorWithRefetch from '@/components/common/indicators/error-with-refetch';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';


export default function StatCard<T>(props: {
  label: string,
  icon: ReactNode,
  dataState: DataState<T>,
  value: () => ReactNode,
  className?: string
}) {
  return (
    <div className={`w-56 md:w-[calc(100%/3)] pl-4 py-2 md:py-4
                   border-(--border-color) ${props.className}`}>
      <div className='block w-56 ml-auto mr-auto'>
        <div className='flex'>
          {props.icon}
          <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>
            {props.label}
          </p>
        </div>
        <div className='pl-12'>
          <props.dataState.Render
            value={props.value}
            errorFallback={<ErrorWithRefetch refetch={props.dataState.fetch} />}
            loadingFallback={<LoadingIndicator />}
          />
        </div>
      </div>
    </div>
  );
}
