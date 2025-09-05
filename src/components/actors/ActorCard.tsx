// components/actors/ActorCard.tsx
"use client";

type Actor = {
  id: string;
  name: string;
  role?: string;
  avatarUrl?: string | null;
  availability?: "Available" | "On hold" | "Busy";
  dayRate?: string;
  scenes?: number;
};

export default function ActorCard({
  actor,
  isActive,
  onClick,
}: {
  actor: Actor;
  isActive?: boolean;
  onClick?: () => void;
}) {
  const { name, role, avatarUrl, availability, dayRate, scenes } = actor;

  const initials = (n: string) =>
    n
      .trim()
      .split(/\s+/)
      .map((s) => s[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const availClass =
    availability === "Available"
      ? "bg-green-100 text-green-800"
      : availability === "On hold"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left rounded-lg border border-gray-200 px-3 py-3 transition-colors",
        "hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300",
        isActive ? "bg-gray-50" : "",
      ].join(" ")}
    >
      {/* top: avatar + name/role */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[12px] font-semibold text-gray-700 overflow-hidden">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            initials(name)
          )}
        </div>
        <div>
          <div className="text-[13px] font-semibold text-gray-900">{name}</div>
          <div className="text-[11px] text-gray-600">{role ?? "Cast"}</div>
        </div>
      </div>

      {/* middle: availability pill */}
      {availability && (
        <div className="mt-3">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${availClass}`}
          >
            {availability}
          </span>
        </div>
      )}

      {/* bottom: meta row */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-gray-700">
        <span>{dayRate ? `Day rate: ${dayRate}` : "Day rate: —"}</span>
        <span>{Number.isFinite(scenes) ? `${scenes} scenes` : "—"}</span>
      </div>
    </button>
  );
}
