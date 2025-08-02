import RefetchIndicator from './refetch-indicator';


export default function ErrorIndicator(props: {
  error?: string,
  refetch?: () => Promise<any>,
  className?: string,
}) {
  return (
    <span className={props.className}>
      <span className='inline-block text-red-800'>
        {props.error ?? 'Error'}
      </span>
      {
        props.refetch ? <RefetchIndicator refetch={props.refetch} /> : ''
      }
    </span>
  );
}
