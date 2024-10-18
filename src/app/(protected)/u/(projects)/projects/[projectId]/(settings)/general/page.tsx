import DeleteProject from './DeleteProject';
import ProjectDetails from './ProjectDetails';

export default function GeneralPage() {
  return (
    <div>
      <h1 className="mb-10 text-2xl font-bold">General</h1>
      <div className="flex flex-col gap-8">
        <ProjectDetails />
        <DeleteProject />
      </div>
    </div>
  );
}
