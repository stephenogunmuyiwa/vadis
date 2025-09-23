import Skeleton from "@/components/creator/ui/Skeleton";

export default function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="h-40 w-full bg-neutral-200 animate-pulse" />{" "}
      {/* poster */}
      <div className="p-5">
        <Skeleton className="h-4 w-40" /> {/* title */}
        <Skeleton className="mt-2 h-10 w-full" /> {/* preview */}
        <div className="mt-3 flex items-center gap-4">
          <Skeleton className="h-4 w-14" /> {/* metric 1 */}
          <Skeleton className="h-4 w-14" /> {/* metric 2 */}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-4 w-44" /> {/* estimated budget */}
      </div>
    </div>
  );
}
