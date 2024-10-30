import DomainDetails from './DomainDetails';

export default function GeneralPage() {
  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">Manage domain</h1>
      <div className="flex flex-col gap-8">
        <DomainDetails />
      </div>
    </div>
  );
}
