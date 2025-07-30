import { DataState } from '@/lib/data-state';
import LoadingPulse from './loading-pulse';


export default function LoadingPulseStatic<T>(props: {
  content: string,
  dataState: DataState<T>,
  className?: string, // Set background with text-color, takes background from currentcolor!
}) {
  return props.dataState.error || props.dataState.value ?
    props.content
    :
    <LoadingPulse
      className={props.className}
      content={props.content}
    />;
}
