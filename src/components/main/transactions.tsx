import { Alchemy } from 'alchemy-sdk';


type Props = {
  alchemy: Alchemy
}

export default async function Transactions(props: Props) {

  return (
    <div className={`border-2 border-[var(--border-color)]
                    rounded-lg w-full md:w-[45%] p-1 md:p-3 mb-2`}>
      <h2>Latest Transactions</h2>
    </div>
  );
}