import EtherStats from './ether-stats';
import TransactionStats from './transaction-stats';


export default async function Stats() {
  return (
    <div className='flex flex-col md:flex-row items-center md:items-start w-full'>
      <EtherStats />
      <TransactionStats />
    </div>
  );
}