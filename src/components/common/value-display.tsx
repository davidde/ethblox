import ErrorIndicator from '@/components/common/indicators/error-indicator';
import LoadingIndicator from '@/components/common/indicators/loading-indicator';


// NEEDS FALSY VALUE TO DIPLAY LoadingIndicator! (unless Error)
// If there's a value, display it;
// if not, and if there's an error, display that;
// if neither, display the LoadingIndicator;
// unless we don't want a visible fallback component,
// then we display an empty span.
export default function ValueDisplay({ value, error, err, fallback = true, fallbackClass }: {
  value: any,
  error: any,    // Full error
  err?: string, // Optional short error to display
  fallback?: boolean, // Optionally don't show ErrorIndicator or LoadingIndicator
  fallbackClass?: string, // Optional className for fallback when no value is present
}) {
  if (value) return value;
  else if (error) {
    if (fallback)
      return <ErrorIndicator error={err ? err : error.toString()} className={fallbackClass} />;
    else return <span className={fallbackClass}>&nbsp;</span>;
  } else if (fallback)
    return <LoadingIndicator className={fallbackClass} />;
  else return <span className={fallbackClass}>&nbsp;</span>;
}
