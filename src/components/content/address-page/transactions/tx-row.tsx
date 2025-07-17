import type { Tx } from '../transactions';
import type { Col } from './transactions-view';


export default function TxRow(props: {
  tx: Tx,
  cols: Col[],
  isMedium: boolean, // True for desktop, false for mobile
}) {
  if (props.isMedium)
    return ( // Desktop View:
      <tr className='w-full border-b border-(--border-color) last-of-type:border-none py-3'>
        {
          props.cols.map((col, i) => (
            <td key={i} className='whitespace-nowrap px-4 py-3'>
              { col.render(props.tx) }
            </td>
          ))
        }
      </tr>
    );
  else return ( // Mobile View:
    <div className='mb-2 w-full py-2 border-b border-(--border-color) last-of-type:border-none'>
      {
        props.cols.map((col, i) => (
          <div key={i} className='pb-1'>
            <span className={`font-medium ${col.name === 'To' ? 'pl-5' : ''}`}>
              { col.name }: &nbsp;
            </span>
            { col.render(props.tx) }
          </div>
        ))
      }
    </div>
  );
}