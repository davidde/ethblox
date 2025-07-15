export default function RedSpan(props: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`${props.className} border rounded-md p-1 px-4
      bg-red-200 text-red-700 border-red-400
      dark:bg-red-500 dark:text-red-100 dark:border-red-300`}>
      {props.children}
    </span>
  );
}