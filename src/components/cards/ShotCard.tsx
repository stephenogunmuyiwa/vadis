// components/cards/ShotCard.tsx
"use client";

type CardProps = {
  id: string;
  client: string;
  date: string;
  status: "Active" | "Paused" | "Completed";
  title: string;
  tags: string[];
  tool: string;
  budget: string;
  due: string;
  unread: number;
  cover?: string;
};

export default function ShotCard({
  client,
  date,
  status,
  title,
  tags,
  tool,
  budget,
  due,
  unread,
  cover,
}: CardProps) {
  return (
    <article className="group rounded-2xl border border-gray-200 bg-white/80 backdrop-blur shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Cover */}
      <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-500">
              {client} • {date}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 leading-snug">
              {title}
            </h3>
          </div>

          <span
            className={`ml-3 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
              status === "Active"
                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                : status === "Paused"
                ? "bg-amber-50 text-amber-700 ring-amber-200"
                : "bg-gray-50 text-gray-700 ring-gray-200"
            }`}
          >
            {status}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] text-gray-600"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Meta */}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px] text-gray-700">
          <div className="flex flex-col">
            <dt className="text-gray-500">Tool</dt>
            <dd className="font-medium">{tool}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-gray-500">Budget</dt>
            <dd className="font-medium">{budget}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-gray-500">Due</dt>
            <dd className="font-medium">{due}</dd>
          </div>
          <div className="flex flex-col">
            <dt className="text-gray-500">Messages</dt>
            <dd className="font-medium">
              {unread > 0 ? `${unread} new` : "—"}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between">
          <button className="text-[12px] font-medium text-indigo-600 hover:underline">
            Open
          </button>
          <button className="text-[12px] text-gray-600 hover:text-gray-900">
            More
          </button>
        </div>
      </div>
    </article>
  );
}
