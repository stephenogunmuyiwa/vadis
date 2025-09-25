// components/brand/placements/FramesStrip.tsx
export function FramesStrip({
  frames,
  onOpen,
}: {
  frames: string[];
  onOpen?: (src: string, index: number) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-gutter:stable]">
      {frames.map((src, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onOpen?.(src, i)}
          className="relative h-20 w-36 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/5 outline-none focus:ring-2 focus:ring-indigo-500 group"
          aria-label={`Open frame ${i + 1}`}
        >
          <img
            src={src}
            alt={`Frame ${i + 1}`}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
        </button>
      ))}
    </div>
  );
}
