import { Alchemy } from 'alchemy-sdk';


type Props = {
  alchemy: Alchemy
}

export default async function Blocks(props: Props) {
  let blockNumber;

  try {
    blockNumber = await props.alchemy.core.getBlockNumber();
  } catch(error) {
    console.error('getBlockNumber() Error: ', error);
  }

  return (
    <div className={`border-2 border-[var(--border-color)]
                    rounded-lg w-full md:w-[50%] p-1 md:p-3 mb-2`}>
      <h2>Latest Blocks</h2>
      <p>Block Number: { blockNumber }</p>
    </div>
  );
}