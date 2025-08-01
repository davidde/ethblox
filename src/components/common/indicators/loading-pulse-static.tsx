import { DataState } from '@/lib/data-state';
import LoadingPulse from './loading-pulse';


export default function LoadingPulseStatic<T>(props: {
  content: string,
  dataState: DataState<T>,
  loadingPulseColor?: string, // Takes background from currentcolor by default!
  className?: string,
}) {
  return props.dataState.loading ?
    <LoadingPulse
      loadingPulseColor={props.loadingPulseColor}
      className={props.className}
      content={props.content}
    />
    :
    props.content;
}
