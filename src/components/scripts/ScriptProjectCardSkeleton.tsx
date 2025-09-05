// src/components/scripts/ScriptProjectCardSkeleton.tsx
export function ScriptProjectCardSkeleton() {
  return (
    <article
      className={[
        "relative rounded-2xl border border-gray-200 bg-gray-50 p-4",
        'before:content-[""] before:absolute before:-top-2 before:left-8 before:h-4 before:w-14 before:rounded-b-xl',
        "before:bg-inherit before:border before:border-gray-200",
        "overflow-hidden",
      ].join(" ")}
      aria-busy="true"
    >
      {/* shimmer layer */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.7),transparent)] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />

      {/* id chip */}
      <div className="h-6 w-24 rounded-md bg-gray-200" />

      {/* title */}
      <div className="mt-3 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-2/5 rounded bg-gray-200" />
      </div>

      {/* preview */}
      <div className="mt-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-200" />
        <div className="h-3 w-11/12 rounded bg-gray-200" />
        <div className="h-3 w-2/3 rounded bg-gray-200" />
      </div>

      {/* chips */}
      <div className="mt-3 flex items-center gap-2">
        <div className="h-6 w-24 rounded-md bg-gray-200" />
        <div className="h-6 w-16 rounded-md bg-gray-200" />
      </div>

      <div className="my-3 h-px w-full bg-gray-200" />

      {/* footer metrics */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-14 rounded bg-gray-200" />
        <div className="h-4 w-14 rounded bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
    </article>
  );
}

/* Tailwind keyframes (global CSS once, e.g. in globals.css)
@keyframes shimmer {
  100% { transform: translateX(100%); }
}
*/
