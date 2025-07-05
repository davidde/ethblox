export default function ErrorIndicator(props: { error: string }) {
  if (props.error) {
    return (
      <div className='text-red-800'>
        <h1 className='text-lg font-bold'>
          Error:
        </h1>
        <p className='ml-[1rem]'>
          {props.error}
        </p>
      </div>
    );
  }
}
