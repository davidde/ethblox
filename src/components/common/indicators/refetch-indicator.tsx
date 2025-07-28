import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function RefetchIndicator(props: { refetch: () => Promise<any> }) {
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
    <ArrowPathIcon
      className={`w-[1em] h-[1em] inline-block ml-[0.75em] ${spin}`}
      onClick={handleClick}
    />
  );
}
