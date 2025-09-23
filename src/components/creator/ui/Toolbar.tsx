import Select from "./Select";
import Button from "./Button";
import { Plus } from "lucide-react";

export default function Toolbar({
  filter,
  onFilter,
  primaryLabel,
  onPrimary,
}: {
  filter?: string;
  onFilter?: (val: string) => void;
  primaryLabel: string;
  onPrimary: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {onFilter && (
        <div className="w-[140px]">
          <Select
            value={filter}
            onChange={onFilter}
            options={[
              { label: "All scripts", value: "All scripts" },
              { label: "Action", value: "Action" },
              { label: "Fantasy", value: "Fantasy" },
              { label: "Sci-Fi", value: "Sci-Fi" },
              { label: "Drama", value: "Drama" },
              { label: "Comedy", value: "Comedy" },
              { label: "Thriller", value: "Thriller" },
              { label: "Horror", value: "Horror" },
            ]}
          />
        </div>
      )}
      <Button
        onClick={onPrimary}
        className="ml-1 inline-flex items-center gap-2"
      >
        <Plus size={16} />
        {primaryLabel}
      </Button>
    </div>
  );
}
