

export default async function Page({ params } :
  { params: Promise<{ hash: string }> })
{
  const hash = (await params).hash;

  return (
    <div>Address: {hash}</div>
  );
}
