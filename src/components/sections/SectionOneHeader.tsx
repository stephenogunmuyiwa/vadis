// components/sections/SectionOneHeader.tsx
"use client";

interface SectionOneHeaderProps {
  title: string;
  createdISO: string;
  createdLabel: string;
  note: string;
  learnMoreHref?: string;
}

export default function SectionOneHeader({
  title,
  createdISO,
  createdLabel,
  note,
  learnMoreHref = "#",
}: SectionOneHeaderProps) {
  return (
    <section className="h-[70px] flex items-center px-4 sm:px-6">
      <div className="w-full flex items-start justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-[20px] sm:text-[20px] font-semibold text-gray-900">
            {title}
          </p>
          <p className="text-[12px] text-gray-600 mt-1">
            Created at <time dateTime={createdISO}>{createdLabel}</time>
          </p>
        </div>

        <div className="max-w-[300px]">
          <p className="text-[10px] leading-relaxed text-gray-700 bg-gray-200 px-3 py-2 rounded">
            {note}{" "}
            <a
              href={learnMoreHref}
              className="font-medium underline underline-offset-2"
            >
              Learn More
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
