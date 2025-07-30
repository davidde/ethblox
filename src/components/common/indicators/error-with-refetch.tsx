import ErrorIndicator from './error-indicator';
import RefetchIndicator from './refetch-indicator';


export default function ErrorWithRefetch(props: {
  refetch: () => Promise<any>,
  error?: string,
  className?: string
}) {
  return (
    <span className={props.className}>
      <ErrorIndicator
        error={props.error}
      />
      <RefetchIndicator refetch={props.refetch} />
    </span>
  );
}
