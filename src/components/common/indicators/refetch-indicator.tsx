import RefetchButton from './refetch-button';


export default function RefetchIndicator(props: {
  refetch: () => Promise<any>,
  message?: string,
  className?: string
}) {
  return (
    <span className={`${props.className} inline-flex`}>
      <span>
        {props.message ?? 'TBD'}
      </span>
      <RefetchButton refetch={props.refetch} className='ml-[0.75em]' />
    </span>
  );
}
