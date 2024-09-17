import { useContext } from 'react';
import NetworkContext from "@/components/providers/network-context";
import { Input, Field, Label } from '@headlessui/react';


export default function Search() {
  const { network } = useContext(NetworkContext);

  return (
    <div className={`w-full md:w-[40rem]`}>
      <h1 className={`text-xl md:text-2xl font-semibold`}>The Ethereum Blockchain Explorer</h1>
      <Field className={`mt-3`}>
        <Label>Search by Address</Label>
        <Input
          name="search_address"
          type="text"
          className={`block w-full rounded-lg py-1.5
                      bg-[var(--main-bg-color)]
                      border-2 border-[var(--border-color)]`}
        />
      </Field>
      <span className={`ml-2 md:ml-8 text-sm font-light`}>
        Network: { network }
      </span>
    </div>
  );
}