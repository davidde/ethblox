export default function PageWrapper(props: { children: React.ReactNode, className?: string }) {
  return (
    <div className='flex items-center justify-center w-full px-[0.5rem] md:px-8'>
      <div className={`${props.className} p-4 md:p-8 rounded-lg border border-(--border-color)
        min-w-[min(max-content,_100%)] max-w-[calc(100vw-1rem)] bg-(--comp-bg-color)`}>
      {props.children}
      </div>
    </div>
  );
}