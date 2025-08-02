import { ReactNode } from 'react';


export default function SpanGreen(props: {
  children: ReactNode,
  className?: string
}) {
  return (
    <span className={`${props.className} border rounded-md p-1 px-4
      bg-green-200 text-green-700 border-green-400
      dark:bg-green-400 dark:text-green-800 dark:border-green-800`}>
      {props.children}
    </span>
  );
}