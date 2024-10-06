import { Alchemy } from 'alchemy-sdk';
import Block from './block';


type Props = {
  blockNumber: number | undefined,
  network: string,
  alchemy: Alchemy
}

export default async function Blocks(props: Props) {
  return (
    <div className='border-2 border-[var(--border-color)]
                    rounded-lg w-full md:w-[48%] my-4 md:my-8'>
      <h2 className='font-bold p-2 md:p-3 border-b-2 border-[var(--border-color)]'>Latest Blocks</h2>
      {
        [...Array(4)].map((x, i) =>
          <Block
            key={i}
            blockNumber={props.blockNumber!-i}
            network={props.network}
            alchemy={props.alchemy}
          />
        )
      }
    </div>
  );
}