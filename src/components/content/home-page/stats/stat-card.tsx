import ValueDisplay from '@/components/common/value-display';


export default function StatCard(props: {
  label: string,
  icon: React.ReactNode,
  value?: React.ReactNode,
  error?: string,
  className?: string
}) {
  return (
    <div className={`w-56 md:w-[calc(100%/3)] pl-4 py-2 md:py-4
                   border-(--border-color) ${props.className}`}>
      <div className='block w-56 ml-auto mr-auto'>
        <div className='flex'>
          {props.icon}
          <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>
            {props.label}
          </p>
        </div>
        <div className='pl-12'>
        <ValueDisplay
          value={props.value}
          error={props.error}
          err='Error'
        />
        </div>
      </div>
    </div>
  );
}
