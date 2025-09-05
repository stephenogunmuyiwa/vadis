// components/scene/SceneMetaAside.tsx
"use client";

interface SceneMeta {
  title: string;
  description: string;
  estimated: string;
  cost: string;
  location: string;
}

export default function SceneMetaAside({ meta }: { meta: SceneMeta }) {
  return (
    <aside className="flex-none w-[300px]">
      <div className="flex flex-col">
        <div>
          <h2 className="text-[15px] sm:text-[20px] font-semibold text-gray-900">
            {meta.title}
          </h2>
          <p className="mt-5 text-[12px] leading-relaxed text-gray-700">
            {meta.description}
          </p>
        </div>

        <div className="flex items-center mt-10 gap-2">
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-[#0A9B00FF] text-[#FFFFFFFF]">
            Est. screen time: {meta.estimated}
          </span>
        </div>
        <div className="flex items-center mt-1 gap-2">
          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium bg-[#0077eb] text-[#FFFFFFFF]">
            Scene location: {meta.location}
          </span>
        </div>

        <div className="mt-2 rounded-md px-2 py-2 flex items-center justify-between bg-[#FFFFFFFF]">
          <div className="text-[12px] text-gray-500">Est. cost</div>
          <div className="text-[15px] font-semibold text-gray-900">
            {meta.cost}
          </div>
        </div>
      </div>
    </aside>
  );
}
