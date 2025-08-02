import RefetchButton from './refetch-button';


export default function ErrorIndicator(props: {
  error?: string,
  refetch?: () => Promise<any>,
  className?: string,
}) {
  return (
    <span className={`${props.className} inline-flex`}>
      <span className='text-red-800'>
        {props.error ?? 'Error'}
      </span>
      {
        props.refetch ? <RefetchButton refetch={props.refetch} className='ml-[0.75em]' /> : ''
      }
    </span>
  );
}
