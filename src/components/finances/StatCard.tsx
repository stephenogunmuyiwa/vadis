// components/finace/StatCard.tsx
import { FC } from "react";
import { CreditCard } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  delta: string;
  deltaTone: "positive" | "negative" | "neutral";
  caption?: string;
  iconBadge?: boolean;
}

const toneClasses: Record<StatCardProps["deltaTone"], string> = {
  positive: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
  negative: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100",
  neutral: "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200",
};

const StatCard: FC<StatCardProps> = ({
  title,
  value,
  delta,
  deltaTone,
  caption,
  iconBadge,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-start justify-between p-5">
        <div>
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${toneClasses[deltaTone]}`}
            >
              {delta}
            </span>
            {caption && (
              <span className="text-xs text-gray-500">{caption}</span>
            )}
          </div>
        </div>

        {iconBadge && (
          <div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
            <CreditCard className="h-5 w-5 text-sky-600" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
