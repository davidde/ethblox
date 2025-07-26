import { DataState } from '@/lib/data-state';
import { getGasPriceGwei, getGasPriceUsd } from '@/lib/utilities';


type Prices = {
  ethPrice: number,
  lowGasPrice: number,
  averageGasPrice: number,
  highGasPrice: number,
};

export default function GastrackerCard({ title, pricesData }: {
  title: string,
  pricesData: DataState<any>,
}) {
  let prices: Prices, gasPrice;
  if (pricesData.value) {
    prices = {
      ethPrice: +pricesData.value.coin_price,
      lowGasPrice: +pricesData.value.gas_prices.slow,
      averageGasPrice: +pricesData.value.gas_prices.average,
      highGasPrice: +pricesData.value.gas_prices.fast,
    }
    gasPrice = Object.entries(prices).find( // find returns a key-value pair (value = [1])
      ([key]) => key.startsWith(title.toLowerCase()) )?.[1]; // OR undefined => `?.` optional chaining required
  }

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
          <pricesData.Render value={ () => getGasPriceGwei(gasPrice!) } />
        </p>
        <p className='text-sm'>
          <pricesData.Render showFallback={false}
            value={ () => getGasPriceUsd(gasPrice!, prices.ethPrice) } />
        </p>
      </div>
    </div>
  );
}