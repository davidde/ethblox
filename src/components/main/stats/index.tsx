import PriceStats from './price-stats';
import TransactionStats from './transaction-stats';
import BlockStats from './block-stats';


export default async function Stats() {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between
      border-2 border-[var(--border-color)]
      rounded-lg w-full md:w-[90%] p-1 md:p-3 my-8 md:my-16`}>
      <PriceStats />

      <TransactionStats />

      <BlockStats />
    </div>
  );
}