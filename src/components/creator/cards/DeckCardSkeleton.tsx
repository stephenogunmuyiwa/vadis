import Skeleton from "@/components/creator/ui/Skeleton";

export default function DeckCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="h-28 w-full bg-neutral-200 animate-pulse" />
      <div className="px-5 py-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-2 h-3 w-24" />
      </div>
    </div>
  );
}
