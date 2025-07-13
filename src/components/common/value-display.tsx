import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';


export default function ValueDisplay({ value, error, err, load = true }: {
  value: any,
  error: any,    // Full error
  err?: string,  // Optional short error to display
  load?: boolean // Show loading indicator
}) {
  const displayError = err ? err : error.toString();
console.log('value:', value);
  return value ||
    (error ?
      <ErrorIndicator error={displayError} />
      :
      load ?
        <LoadingIndicator />
        :
        <span>&nbsp;</span>
    );
}
