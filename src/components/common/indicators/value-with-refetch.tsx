import RefetchIndicator from './refetch-indicator';


export default function ValueWithRefetch(props: {
  refetch: () => Promise<any>,
  value: string,
  className?: string
}) {
  return (
    <span>
      <span className={`${props.className} inline-block`}>
        {props.value}
      </span>
      <RefetchIndicator refetch={props.refetch} />
    </span>
  );
}
