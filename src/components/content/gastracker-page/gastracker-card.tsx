import ValueDisplay from "@/components/common/value-display";


export default function GastrackerCard({
  title,
  gasPriceGwei,
  gasPriceUsd,
  priceError,
  smiley,
  smileyLabel,
  colorClass,
}: {
  title: string,
  gasPriceGwei?: string,
  gasPriceUsd?: string,
  priceError: any,
  smiley?: string,
  smileyLabel?: string,
  colorClass?: string,
}) {
  return (
    <div className='w-58 px-16 py-4 my-2 ml-auto mr-auto
              border border-(--border-color) rounded-lg'>
      <p className='font-bold mb-3'>
        <span className='text-xl mr-2' role="img" aria-label={smileyLabel}>
          {smiley}
        </span>
        {title}
      </p>
      <div className={`text-lg tracking-wide ${colorClass}`}>
        <p><ValueDisplay value={gasPriceGwei} error={priceError} err='Error' /></p>
        <p className='text-sm'>
          <ValueDisplay value={gasPriceUsd} error={priceError} err='Error' fallback={false} />
        </p>
      </div>
    </div>
  );
}