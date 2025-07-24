import { useState } from 'react';
import ErrorIndicator from './error-indicator';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function ErrorWithRetry(props: {
  retry?: () => Promise<void>,
  error?: string,
  className?: string
}) {
  if (!props.retry) return <ErrorIndicator
                             className={props.className}
                             error={props.error}
                           />;

  const [isLoading, setIsLoading] = useState(false);
  const spinning = isLoading ? 'animate-spin' : '';

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await props.retry!(); // Handles its own errors
    } finally {
      setIsLoading(false); // Always runs!
    }
  };

  return (
    <span>
      <ErrorIndicator
        className={props.className}
        error={props.error}
      />
      <ArrowPathIcon
        className={`w-4 h-4 inline-block ml-[0.75em] cursor-pointer ${spinning}`}
        onClick={handleClick}
      />
    </span>
  );
}
