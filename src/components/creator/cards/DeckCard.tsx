import { PitchDeck } from "@/types/creator/creator";
import { ExternalLink, FileText } from "lucide-react";

export default function DeckCard({ item }: { item: PitchDeck }) {
  const hasUrl = Boolean(item.url);

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:border-[#0007CCFF]">
      {/* Preview header */}
      <div className="relative h-28 w-full bg-neutral-100">
        {hasUrl ? (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/pdf_logo.png"
                alt={`${item.project_title}`}
                className="h-30 w-full object-cover"
                loading="lazy"
              />
            </div>
            <a
              href={item.url as string}
              target="_blank"
              rel="noreferrer"
              className="group absolute inset-0 outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Open pitch deck for ${item.project_title}`}
            />
            <div className="pointer-events-none absolute right-2 top-2 rounded-md bg-white/80 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
              <ExternalLink size={14} className="text-neutral-700" />
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            <FileText size={16} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="line-clamp-1 text-[15px] font-medium text-neutral-800">
            {item.project_title}
          </div>

          {hasUrl && (
            <a
              href={item.url as string}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
              title="Open deck"
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>

        <div className="mt-1 text-xs text-neutral-500">
          {item.created_date
            ? new Date(item.created_date).toLocaleString()
            : "Generated deck"}
        </div>
      </div>
    </div>
  );
}
