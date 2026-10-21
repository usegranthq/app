export default function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.02em]">
      <span className="flex items-center gap-[3px]">
        <span className="size-2.5 bg-(--accent)" />
        <span className="h-px w-2 bg-[#ededed]" />
        <span className="size-2.5 border-[1.5px] border-[#ededed]" />
      </span>
      <span>useGrant</span>
    </span>
  );
}
