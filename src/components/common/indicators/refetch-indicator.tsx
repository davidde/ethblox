import RefetchButton from './refetch-button';


export default function RefetchIndicator(props: {
  refetch: () => Promise<any>,
  message?: string,
  className?: string
}) {
  return (
    <span className={`${props.className} inline-block`}>
      <span>
        {props.message ?? 'TBD'}
      </span>
      <RefetchButton refetch={props.refetch} />
    </span>
  );
}
