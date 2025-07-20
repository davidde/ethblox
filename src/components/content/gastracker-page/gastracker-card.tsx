import DataState from '@/lib/data-state';
import { type Prices } from '../gastracker-page';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';


export default function GastrackerCard({ title, prices }: {
  title: string,
  prices: DataState<Prices>,
}) {
  let gasPriceGwei, gasPriceUsd, smiley, smileyLabel, colorClass;
  switch (title) {
    case 'Low':
      gasPriceGwei = () => getGasPriceGwei(prices.value!.lowGasPrice);
      gasPriceUsd = () => getGasPriceUsd(prices.value!.lowGasPrice, prices.value!.ethPrice);
      smiley = '😎';
      smileyLabel = 'smiling face with sunglasses';
      colorClass = 'text-green-600';
      break;
    case 'Average':
      gasPriceGwei = () => getGasPriceGwei(prices.value!.averageGasPrice);
      gasPriceUsd = () => getGasPriceUsd(prices.value!.averageGasPrice, prices.value!.ethPrice);
      smiley = '😁';
      smileyLabel = 'beaming face with smiling eyes';
      colorClass = 'text-blue-600';
      break;
    case 'High':
      gasPriceGwei = () => getGasPriceGwei(prices.value!.highGasPrice);
      gasPriceUsd = () => getGasPriceUsd(prices.value!.highGasPrice, prices.value!.ethPrice);
      smiley = '😵';
      smileyLabel = 'face with crossed-out eyes';
      colorClass = 'text-red-600';
      break;
  }

  return (
    <div className='w-58 px-16 py-4 my-2 ml-auto mr-auto bg-(--card-bg-color)
                    shadow-xl border border-(--border-color) rounded-lg'>
      <p className='font-bold mb-3'>
        <span className='text-xl mr-2' role='img' aria-label={smileyLabel}>
          {smiley}
        </span>
        {title}
      </p>
      <div className={`text-lg tracking-wide ${colorClass}`}>
        <p>
          <prices.Render value={gasPriceGwei} error='Error' />
        </p>
        <p className='text-sm'>
          <prices.Render value={gasPriceUsd} showFallback={false} />
        </p>
      </div>
    </div>
  );
}