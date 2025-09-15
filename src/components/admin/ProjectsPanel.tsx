// src/components/admin/ProjectsPanel.tsx
"use client";

import { useMemo, useState } from "react";
import { Filter, ArrowUpDown, Upload, ChevronDown } from "lucide-react";
import { useAdminProjects } from "@/hooks/admin/useAdminProjects";

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

export default function ProjectsPanel() {
  const {
    projects,
    loading,
    stats,
    q,
    setQ,
    creator,
    setCreator,
    status,
    setStatus,
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
    remove,
    exportProjects,
  } = useAdminProjects();

  const [openFilter, setOpenFilter] = useState(false);
  const [openSort, setOpenSort] = useState(false);

  const grid = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        title: p.title,
        creator: p.creatorName,
        updated: fmtDate(p.updatedAt),
      })),
    [projects]
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
                    { k: "updated_at", label: "Updated" },
                    { k: "title", label: "Title" },
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
        </div>

        <div className="flex items-center gap-2">
          <button className="btn">Customize</button>
          <button
            className="btn flex items-center gap-2"
            onClick={() => exportProjects("csv")}
          >
            <Upload size={16} /> Export
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Total projects:{" "}
          <span className="font-medium text-gray-900">{stats.total}</span>
          <span className="ml-3 text-gray-400">
            Updated today: {stats.updatedToday}
          </span>
        </div>
        <input
          placeholder="Search project…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-lg border bg-white px-3 py-2 text-sm"
        />
      </div>

      {/* DATA VIEW */}
      {view === "table" ? (
        <div className="card table-shell">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Creator</th>
                <th>Last modified</th>
                <th>Project ID</th>
                <th className="w-64">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 text-gray-500">
                    Loading projects…
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-gray-500">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.id} className="row">
                    <td className="font-medium">{p.title}</td>
                    <td>{p.creatorName}</td>
                    <td>{fmtDate(p.updatedAt)}</td>
                    <td className="font-mono text-xs">{p.id}</td>
                    <td className="flex gap-2">
                      <button className="btn text-xs">Check piracy</button>
                      <button className="btn text-xs">Review</button>
                      <button
                        onClick={() => remove(p.id)}
                        className="btn text-xs text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <div className="text-gray-500 text-sm">Loading projects…</div>
          ) : grid.length === 0 ? (
            <div className="text-gray-500 text-sm">No projects found.</div>
          ) : (
            grid.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{p.creator}</div>
                <div className="text-xs text-gray-500 mt-1">{p.updated}</div>
                <div className="mt-3 flex gap-2">
                  <button className="btn text-xs">Check piracy</button>
                  <button className="btn text-xs">Review</button>
                  <button
                    onClick={() => remove(p.id)}
                    className="btn text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Remove
                  </button>
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
              <div className="text-xs text-gray-600 mb-1">Creator</div>
              <input
                placeholder="email or name…"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full rounded-lg border p-2"
              />
            </div>

            <div>
              <div className="text-xs text-gray-600 mb-1">Status</div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-lg border p-2"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="text-xs text-gray-600 mb-1">Updated (from)</div>
                <input
                  type="date"
                  value={dateFrom ?? ""}
                  onChange={(e) => setDateFrom(e.target.value || undefined)}
                  className="w-full rounded-lg border p-2"
                />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Updated (to)</div>
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
                setCreator("");
                setStatus("all");
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
    </div>
  );
}
