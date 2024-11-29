type Props = {
  ethBalance: string,
  network: string
}

export default async function EthBalance(props: Props) {
  let valueEur, valueUsd;
  let error = false;
  const showEthValue = props.network === 'mainnet' ? '' : 'hidden';

  if (props.network === 'mainnet') {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur,usd');
      const data = await response.json();
      valueEur = (+props.ethBalance * data.ethereum.eur).toLocaleString('en-US',
        {
          style: 'currency',
          currency: 'EUR',
        });
      valueUsd = (+props.ethBalance * data.ethereum.usd).toLocaleString('en-US',
        {
          style: 'currency',
          currency: 'USD',
        });
    } catch(err) {
      console.error('Coingecko Error: ', err);
      error = true;
    }
  }

  return (
    <div className='pr-12'>
      <div className='m-4'>
        <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>ETH BALANCE</h2>
        Ξ{props.ethBalance}
      </div>
      <div className={`m-4 ${showEthValue}`}>
        <h2 className='text-sm tracking-wider text-[var(--grey-fg-color)]'>ETH VALUE</h2>
        {
          error ?
            <div className='text-red-500'>
              Error getting ether value.
            </div>
            :
            <div>
              <p>{valueEur}</p>
              <p>{valueUsd}</p>
            </div>
        }
      </div>
    </div>
  );
}