// src/components/scene/SceneEmpty.tsx
"use client";

export default function SceneEmpty() {
  return (
    <section className="flex-1 mt-[5px] min-h-0 px-4 sm:px-6 py-6 overflow-auto bg-[#0000000C] rounded-lg border border-black/5">
      <div className="h-full w-full grid place-items-center text-center">
        <div>
          <p className="text-[15px] font-semibold text-gray-900">
            No scene selected
          </p>
          <p className="mt-1 text-[12px] text-gray-600">
            Pick a scene from the list above to view details, metadata, and
            shots.
          </p>
        </div>
      </div>
    </section>
  );
}
