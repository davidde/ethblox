import { useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';


export default function RefetchButton(props: {
  refetch: () => Promise<any>,
  className?: string,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const spin = isLoading ? 'animate-spin cursor-default' : 'cursor-pointer';

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await props.refetch(); // Handles its own errors
    } finally {
      setIsLoading(false); // Always runs!
    }
  };

  return (
    <button onClick={handleClick}>
      <ArrowPathIcon className={`w-[1em] h-[1em] ${spin} ${props.className}`} />
    </button>
  );
}
