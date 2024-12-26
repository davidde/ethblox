import { Alchemy } from 'alchemy-sdk';


type Props = {
  hash: string,
  network: string,
  alchemy: Alchemy
}

export default async function TransactionPage(props: Props) {

  return (
    <main>
      <div className='mt-0 m-4'>
        <p className='text-lg font-bold'>
          Transaction:
        </p>
        <p className='max-w-[90vw] break-words'>
          {props.hash}
        </p>
      </div>
    </main>
  );
}
