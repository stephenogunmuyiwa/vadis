import Button from "./Button";
import { Notebook } from "lucide-react";

export default function EmptyState({
  title,
  description,
  cta,
  onClick,
}: {
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="flex h-[520px] w-full flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white">
      <div className="mb-6 rounded-xl bg-neutral-100 p-6">
        <Notebook size={40} className="text-neutral-400" />
      </div>
      <p className="max-w-sm text-center text-sm text-neutral-500">
        {description}
      </p>
      <Button className="mt-6" onClick={onClick}>
        {cta}
      </Button>
    </div>
  );
}
