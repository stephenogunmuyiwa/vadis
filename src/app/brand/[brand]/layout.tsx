import { Sidebar } from "@/components/brand/layout/Sidebar";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <main className="mx-auto w-full max-w-[1120px] p-6">{children}</main>
    </div>
  );
}
