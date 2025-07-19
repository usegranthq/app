import TextFlip from '@/shadcn/components/external/text-flip';

export default function DynamicEnv() {
  return (
    <div className="mt-28 flex flex-col items-center md:mt-28">
      <h2 className="text-3xl font-bold md:text-5xl">
        It&apos;s all
        <TextFlip words={['virtual', 'dynamic', 'scalable']} className="ml-2 text-3xl md:text-5xl" interval={5000} />
      </h2>
      <p className="mt-4 max-w-2xl text-center text-muted-foreground">
        No more spinning up physical servers. Scale up and down on the fly. Create providers and tenants instantly using
        the SDK or REST API, allowing you to establish trust-based access without manual configurations.
      </p>
    </div>
  );
}
