import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';


export default function ValueDisplay({ value, error, err, load = true }: {
  value: any,
  error: any,    // Full error
  err?: string,  // Optional short error to display
  load?: boolean // Show loading indicator
}) {
  if (value) return value;
  else if (error) return <ErrorIndicator error={err ? err : error.toString()} />;
  else if (load) return <LoadingIndicator />;
  else return <span>&nbsp;</span>;
}
