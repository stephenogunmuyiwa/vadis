export function FramesStrip({ frames }: { frames: string[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {frames.map((src, i) => (
        <img
          key={i}
          src={src}
          alt=""
          className="h-20 w-36 shrink-0 rounded-lg object-cover"
        />
      ))}
    </div>
  );
}
