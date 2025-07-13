import ValueDisplay from "@/components/common/value-display";


export default function GastrackerCard({
  header,
  gasPriceGwei,
  gasPriceUsd,
  priceError,
  className,
  smiley,
  smileyLabel,
  colorClass,
}: {
  header: string,
  gasPriceGwei?: string,
  gasPriceUsd?: string,
  priceError: any,
  className?: string,
  smiley?: string,
  smileyLabel?: string,
  colorClass?: string,
}) {
  return (
    <div className={`${className} border border-(--border-color) rounded-lg px-16 py-4 w-58 ml-auto mr-auto`}>
      <p className='font-bold mb-3'>
        <span className='text-xl mr-2' role="img" aria-label={smileyLabel}>
          {smiley}
        </span>
        {header}
      </p>
      <p className={`text-lg tracking-wide ${colorClass}`}>
        <ValueDisplay value={gasPriceGwei} error={priceError} err='Error' />
      </p>
      <p className={`text-sm tracking-wide ${colorClass}`}>
        <ValueDisplay value={gasPriceUsd} error={priceError} err='Error' loading={false} />
      </p>
    </div>
  );
}