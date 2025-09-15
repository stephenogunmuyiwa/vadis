// src/components/admin/UsersPanel.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Filter,
  ArrowUpDown,
  BarChart3,
  Upload,
  UserPlus,
  ChevronDown,
} from "lucide-react";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import AddUserDrawer from "./AddUserDrawer";

function fmtDate(sec?: number) {
  if (!sec) return "—";
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(new Date(sec * 1000));
  } catch {
    return "—";
  }
}

export default function UsersPanel() {
  const {
    users,
    loading,
    total,
    q,
    setQ,
    role,
    setRole,
    activeFilter,
    setActiveFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sortField,
    setSortField,
    sortDir,
    setSortDir,
    view,
    setView,
    showStats,
    setShowStats,
    stats,
    addUser,
    setActive,
    exportUsers,
  } = useAdminUsers();

  const [openAdd, setOpenAdd] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const roleOptions = [
    "production",
    "creator",
    "investor",
    "brand",
    "admin",
  ] as const;

  // grid cards (derived once)
  const grid = useMemo(
    () =>
      users.map((u) => ({
        id: u.id,
        initials: (u.name || u.email)
          .split(" ")
          .map((s) => s[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
        name: u.name || "—",
        email: u.email,
        role: u.role,
        last: fmtDate(u.lastActive),
        active: u.active,
      })),
    [users]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="card p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="hidden sm:flex items-center rounded-lg border overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${
                view === "table" ? "bg-white" : "bg-white/60 text-gray-500"
              }`}
              onClick={() => setView("table")}
            >
              Table View
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${
                view === "grid" ? "bg-white" : "bg-white/60 text-gray-500"
              }`}
              onClick={() => setView("grid")}
            >
              Grid
            </button>
          </div>

          {/* Filter */}
          <button
            className="btn flex items-center gap-2"
            onClick={() => setOpenFilter(true)}
          >
            <Filter size={16} /> Filter
          </button>

          {/* Sort */}
          <div className="relative">
            <button
              className="btn flex items-center gap-2"
              onClick={() => setOpenSort((s) => !s)}
            >
              <ArrowUpDown size={16} /> Sort <ChevronDown size={14} />
            </button>
            {openSort && (
              <div className="absolute z-20 mt-2 w-56 card p-2">
                <div className="text-xs text-gray-500 px-2 pb-1">Sort by</div>
                <div className="space-y-1">
                  {[
                    { k: "last_active", label: "Last active" },
                    { k: "name", label: "Name" },
                    { k: "role", label: "Role" },
                  ].map((opt) => (
                    <button
                      key={opt.k}
                      onClick={() => setSortField(opt.k as any)}
                      className={`w-full text-left px-2 py-1 rounded-md text-sm ${
                        sortField === opt.k ? "bg-gray-100" : "hover:bg-gray-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSortDir("asc")}
                    className={`btn text-sm ${
                      sortDir === "asc" ? "btn--primary text-white" : "bg-white"
                    }`}
                  >
                    Asc
                  </button>
                  <button
                    onClick={() => setSortDir("desc")}
                    className={`btn text-sm ${
                      sortDir === "desc"
                        ? "btn--primary text-white"
                        : "bg-white"
                    }`}
                  >
                    Desc
                  </button>
                </div>
                <div className="mt-2">
                  <button
                    className="btn w-full text-sm"
                    onClick={() => setOpenSort(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Show stats */}
          <div className="flex items-center gap-2 ml-2 text-sm">
            <BarChart3 size={16} />
            <span className="text-gray-700">Show statistics</span>
            <div
              role="switch"
              aria-label="show statistics"
              className="switch"
              data-on={showStats}
              onClick={() => setShowStats((s) => !s)}
            >
              <span className="switch__dot" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn">Customize</button>
          <button
            className="btn flex items-center gap-2"
            onClick={() => exportUsers("csv")}
          >
            <Upload size={16} /> Export
          </button>
          <button
            onClick={() => setOpenAdd(true)}
            className="btn btn--primary flex items-center gap-2"
          >
            <UserPlus size={16} /> Add user
          </button>
        </div>
      </div>

      {/* Inline search + quick role filter */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Users: <span className="font-medium text-gray-900">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search user…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg border bg-white px-3 py-2 text-sm"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
            className="rounded-lg border bg-white px-3 py-2 text-sm"
          >
            <option value="all">All roles</option>
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r[0].toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats row (toggleable) */}
      {showStats && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card p-3 text-sm">
            <div className="text-xs text-gray-500">
              Active % (in current view)
            </div>
            <div className="text-xl font-semibold mt-1">{stats.activePct}%</div>
          </div>
          {["production", "creator", "investor", "brand", "admin"].map((r) => (
            <div key={r} className="card p-3 text-sm">
              <div className="text-xs text-gray-500">
                {r[0].toUpperCase() + r.slice(1)}
              </div>
              <div className="text-xl font-semibold mt-1">
                {stats.countsByRole[r] ?? 0}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DATA VIEW */}
      {view === "table" ? (
        <div className="card table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Full name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last active</th>
                <th className="w-24">Active</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-6 text-gray-500">
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const initials = (u.name || u.email)
                    .split(" ")
                    .map((s) => s[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  return (
                    <tr key={u.id} className="row">
                      <td>
                        <div className="h-8 w-8 rounded-full bg-gray-900 text-white grid place-content-center text-xs">
                          {initials}
                        </div>
                      </td>
                      <td className="font-medium">{u.name || "—"}</td>
                      <td className="text-gray-600">{u.email}</td>
                      <td>
                        <span className="badge badge--info">{u.role}</span>
                      </td>
                      <td className="text-gray-600">{fmtDate(u.lastActive)}</td>
                      <td>
                        <div
                          role="switch"
                          aria-label="active"
                          className="switch"
                          data-on={u.active}
                          onClick={() => setActive(u.id, !u.active)}
                        >
                          <span className="switch__dot" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <div className="text-gray-500 text-sm">Loading users…</div>
          ) : grid.length === 0 ? (
            <div className="text-gray-500 text-sm">No users found.</div>
          ) : (
            grid.map((u) => (
              <div key={u.id} className="card p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-900 text-white grid place-content-center text-sm">
                  {u.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{u.name}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {u.email}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="badge badge--info">{u.role}</span>
                    <span className="text-xs text-gray-500">{u.last}</span>
                  </div>
                </div>
                <div
                  role="switch"
                  aria-label="active"
                  className="switch"
                  data-on={u.active}
                  onClick={() => setActive(u.id, !u.active)}
                >
                  <span className="switch__dot" />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FILTER DRAWER */}
      <div
        className={`fixed inset-0 z-[60] ${
          openFilter ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            openFilter ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpenFilter(false)}
        />
        <div
          className={`absolute right-0 top-0 h-full w-[360px] bg-white border-l p-4 transition-transform ${
            openFilter ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Filters</h3>
            <button
              onClick={() => setOpenFilter(false)}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Close
            </button>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="text-xs text-gray-600 mb-1">Role</div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full rounded-lg border p-2"
              >
                <option value="all">All roles</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r[0].toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Status</div>
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value as any)}
                className="w-full rounded-lg border p-2"
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">Disabled</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  Last active (from)
                </div>
                <input
                  type="date"
                  value={dateFrom ?? ""}
                  onChange={(e) => setDateFrom(e.target.value || undefined)}
                  className="w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">
                  Last active (to)
                </div>
                <input
                  type="date"
                  value={dateTo ?? ""}
                  onChange={(e) => setDateTo(e.target.value || undefined)}
                  className="w-full rounded-lg border p-2"
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              className="btn w-full"
              onClick={() => {
                setActiveFilter("all");
                setDateFrom(undefined);
                setDateTo(undefined);
              }}
            >
              Reset
            </button>
            <button
              className="btn btn--primary w-full text-white"
              onClick={() => setOpenFilter(false)}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <AddUserDrawer
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={async (v) => {
          await addUser(v);
        }}
      />
    </div>
  );
}
