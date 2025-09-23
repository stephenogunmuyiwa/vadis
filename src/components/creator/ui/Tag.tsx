export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
      {children}
    </span>
  );
}
