export default function PageWrapper({ children, maxWidthMd = '62rem' }: {
  children: React.ReactNode,
  maxWidthMd?: string
}) {
  return (
    <div className='flex items-center justify-center w-full px-[0.5rem] md:px-8'>
      <div className={`p-4 md:p-8 w-full max-w-[calc(100vw-1rem)] md:max-w-[${maxWidthMd}]
          border border-(--border-color) bg-(--comp-bg-color) rounded-lg`}>
        {children}
      </div>
    </div>
  );
}