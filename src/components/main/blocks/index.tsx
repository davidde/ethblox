import { Alchemy } from 'alchemy-sdk';
import Block from './block';


type Props = {
  network: string,
  alchemy: Alchemy
}

export default async function Blocks(props: Props) {
  let blockNumber: number;

  try {
    blockNumber = await props.alchemy.core.getBlockNumber();
  } catch(error) {
    console.error('getBlockNumber() Error: ', error);
  }

  return (
    <div className='border-2 border-[var(--border-color)]
                    rounded-lg w-full md:w-[50%] mb-2'>
      <h2 className='font-bold p-2 md:p-3 border-b-2 border-[var(--border-color)]'>Latest Blocks</h2>
      {
        [...Array(4)].map((x, i) =>
          <Block
            key={i}
            blockNumber={blockNumber-i}
            network={props.network}
            alchemy={props.alchemy}
          />
        )
      }
    </div>
  );
}