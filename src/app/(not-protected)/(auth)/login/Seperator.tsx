export default function Seperator() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="rounded bg-background px-2 py-0.5 text-muted-foreground">Or continue with</span>
      </div>
    </div>
  );
}
