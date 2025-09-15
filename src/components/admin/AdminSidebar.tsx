// src/components/admin/AdminSidebar.tsx
"use client";
import { LayoutDashboard, Users, FolderKanban, Settings } from "lucide-react";

const items = [
  { k: "Overview", icon: LayoutDashboard },
  { k: "Users", icon: Users },
  { k: "Projects", icon: FolderKanban },
  { k: "System settings", icon: Settings },
];

export default function AdminSidebar({
  tab,
  onSelect,
}: {
  tab: string;
  onSelect: (t: string) => void;
}) {
  return (
    <aside className="w-[240px] border-r bg-white/90 backdrop-blur sticky top-0 h-screen p-4">
      <div className="font-semibold mb-5 text-xs text-gray-500 px-2">ADMIN</div>
      <nav className="space-y-1">
        {items.map(({ k, icon: Icon }) => {
          const active = tab === k;
          return (
            <button
              key={k}
              onClick={() => onSelect(k)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition
                ${
                  active
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
            >
              <Icon size={18} />
              <span>{k}</span>
              {active && (
                <span className="ml-auto h-2 w-1 rounded bg-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
