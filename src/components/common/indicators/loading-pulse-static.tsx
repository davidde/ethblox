import { DataState } from '@/lib/data-state';
import LoadingPulse from './loading-pulse';


export default function LoadingPulseStatic<T>(props: {
  content: string,
  dataState: DataState<T>,
  className: string, // Requires className only to set background color, width is derived from content!
}) {
  return props.dataState.error || props.dataState.value ?
    props.content
    :
    <LoadingPulse
      className={props.className}
      content={props.content}
    />;
}
