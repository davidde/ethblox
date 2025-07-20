import DataState from '@/lib/data-state';
import { type Prices } from '../gastracker-page';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';


export default function GastrackerCard({ title, prices }: {
  title: string,
  prices: DataState<Prices>,
}) {
  // Callback to get low/average/highGasPrice depending on component:
  const gasPrice = () => Object.entries(prices.value!).find( // find returns a key-value pair (value = [1])
    ([key]) => key.startsWith(title.toLowerCase()) )?.[1]; // OR undefined => `?.` optional chaining required

  let smiley, smileyLabel, colorClass;
  switch (title) {
    case 'Low':
      smiley = '😎';
      smileyLabel = 'smiling face with sunglasses';
      colorClass = 'text-green-600';
      break;
    case 'Average':
      smiley = '😁';
      smileyLabel = 'beaming face with smiling eyes';
      colorClass = 'text-blue-600';
      break;
    case 'High':
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
          <prices.Render error='Error'
            value={ () => getGasPriceGwei(gasPrice()!) } />
        </p>
        <p className='text-sm'>
          <prices.Render showFallback={false}
            value={ () => getGasPriceUsd(gasPrice()!, prices.value!.ethPrice) } />
        </p>
      </div>
    </div>
  );
}