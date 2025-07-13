import ErrorIndicator from '@/components/common/error-indicator';
import LoadingIndicator from '@/components/common/loading-indicator';


export default function ValueDisplay({ value, error, err, loading = true, placeholderClass }: {
  value: any,
  error: any,    // Full error
  err?: string, // Optional short error to display
  loading?: boolean, // Optionally don't show LoadingIndicator
  placeholderClass?: string, // Optional className for placeholder when no value is present
}) {
  if (value) return value;
  else if (error) return <ErrorIndicator error={err ? err : error.toString()}
                                         className={placeholderClass} />;
  else if (loading) return <LoadingIndicator className={placeholderClass} />;
  else return <span className={placeholderClass}>&nbsp;</span>;
}
