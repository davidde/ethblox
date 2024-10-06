import EtherStats from './ether-stats';
import TransactionStats from './transaction-stats';


export default async function Stats() {
  return (
    <div className='flex flex-col md:flex-row items-start md:items-center justify-between
                    w-full md:w-[90%] my-8 md:my-16'>
      <EtherStats />
      <TransactionStats />
    </div>
  );
}