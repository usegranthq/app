import DeleteProvider from './DeleteProvider';
import ProviderDetails from './ProviderDetails';

export default function GeneralPage() {
  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">General</h1>
      <div className="flex flex-col gap-8">
        <ProviderDetails />
        <DeleteProvider />
      </div>
    </div>
  );
}
