export default function GreenSpan(props: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`${props.className} border rounded-md p-1 px-4 h-[2.2rem]
      bg-green-200 text-green-700 border-green-400
      dark:bg-green-400 dark:text-green-800 dark:border-green-800`}>
      {props.children}
    </span>
  );
}