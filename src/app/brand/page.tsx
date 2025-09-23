// app/brand/page.tsx  (SERVER COMPONENT)
import { Suspense } from "react";
import BrandEntryClient from "@/components/brand/BrandEntryClient";

export const dynamic = "force-dynamic"; // avoid prerender issues
// export const revalidate = 0; // (optional) also disables caching for SSR

export default function BrandEntryPage({
  searchParams,
}: {
  searchParams: { create?: string };
}) {
  const forceCreate = searchParams?.create === "1";

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      }
    >
      <BrandEntryClient forceCreate={forceCreate} />
    </Suspense>
  );
}
