

export default async function Page({ params } :
  { params: Promise<{ hash: string }> })
{
  const hash = (await params).hash;
  // Todo: Fill in data with:
  //       - https://docs.alchemy.com/reference/gettokensforowner-sdk
  //       - https://docs.alchemy.com/reference/sdk-getassettransfers

  return (
    <div>
      Address: {hash}
    </div>
  );
}
