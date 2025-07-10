import ErrorIndicator from "@/components/common/error-indicator";
import LoadingIndicator from "@/components/common/loading-indicator";

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
          <p className='pt-2 pl-4 text-xs tracking-wider text-(--grey-fg-color)'>{props.label}
          </p>
        </div>
        <div className='pl-12'>
          {
            props.value || (props.error ?
              <ErrorIndicator error="Error" />
              :
              <LoadingIndicator />)
          }
        </div>
      </div>
    </div>
  );
}
