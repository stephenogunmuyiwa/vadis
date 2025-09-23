import { ScriptItem } from "@/types/creator/creator";
import Tag from "../ui/Tag";
import Metric from "../ui/Metric";

export default function ScriptCard({ item }: { item: ScriptItem }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-[#383eff]">
      <h4 className="mb-1 text-[15px] mt-[50px] font-medium text-neutral-800">
        {item.name}
      </h4>
      <p className="line-clamp-2 h-10 text-sm text-neutral-500">
        {item.description}
      </p>
      <div className="mt-3 flex items-center gap-4">
        <Metric icon="pages" value={item.pages} />
        <Metric icon="users" value={item.collaborators} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}
