import { FileText, Users } from "lucide-react";

export default function Metric({
  icon,
  value,
}: {
  icon: "pages" | "users";
  value: number;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
      {icon === "pages" ? <FileText size={14} /> : <Users size={14} />}
      <span>{value}</span>
    </div>
  );
}
