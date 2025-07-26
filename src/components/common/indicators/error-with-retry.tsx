import { useState } from 'react';
import ErrorIndicator from './error-indicator';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function ErrorWithRetry(props: {
  refetch: () => Promise<void>,
  error?: string,
  className?: string
}) {
  const [isLoading, setIsLoading] = useState(false);
  const spin = isLoading ? 'animate-spin cursor-default' : 'cursor-pointer';

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await props.refetch!(); // Handles its own errors
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
        className={`w-[1em] h-[1em] inline-block ml-[0.75em] ${spin}`}
        onClick={handleClick}
      />
    </span>
  );
}
