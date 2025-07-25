import Link from 'next/link';


export default function NotFoundPage(props: { reason?: string }) {
  return (
    <main className='p-2 md:p-8 text-red-700'>
      <div className='py-8 px-4 mx-auto max-w-(--breakpoint-xl) lg:py-16 lg:px-6'>
        <div className='mx-auto max-w-(--breakpoint-sm) text-center'>
          <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500'>404</h1>
          <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>Not Found.</p>
          {
            props.reason ?
              <p className='whitespace-pre-line mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
                {props.reason}
              </p>
              :
              <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
                Sorry, we can&apos;t find that page.
              </p>
          }
          <Link href='/' className='inline-flex text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-hidden focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'>Back to Homepage</Link>
        </div>
      </div>
    </main>
  );
}
