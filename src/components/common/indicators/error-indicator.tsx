import RefetchButton from './refetch-button';


export default function ErrorIndicator(props: {
  error?: string,
  refetch?: () => Promise<any>,
  className?: string,
}) {
  return (
    <span className={`${props.className} inline-block`}>
      <span className='text-red-800'>
        {props.error ?? 'Error'}
      </span>
      {
        props.refetch ? <RefetchButton refetch={props.refetch} /> : ''
      }
    </span>
  );
}
