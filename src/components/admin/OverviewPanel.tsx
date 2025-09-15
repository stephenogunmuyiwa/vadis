// src/components/admin/OverviewPanel.tsx
"use client";

import { useAdminOverview } from "@/hooks/admin/useAdminOverview";

function fmtDate(sec?: number) {
  if (!sec || Number.isNaN(sec)) return "—";
  try {
    const d = new Date(Math.floor(sec) * 1000);
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d);
  } catch {
    return "—";
  }
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="card p-4">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      {hint ? (
        <div className="text-xs text-emerald-600 mt-1">{hint}</div>
      ) : null}
    </div>
  );
}

export default function OverviewPanel() {
  const { data, loading, error } = useAdminOverview();

  if (loading)
    return <div className="text-sm text-gray-500">Loading overview…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!data) return null;

  const users = data.recentActiveUsers ?? [];
  const brands = data.recentBrands ?? [];
  const projects = data.recentProjects ?? [];

  return (
    <div className="space-y-6">
      {/* ===== KPI STRIP (like the second UI) ===== */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <Stat label="Total users" value={data.totals.users.all} />
        <Stat label="Production" value={data.totals.users.production} />
        <Stat label="Creators" value={data.totals.users.creator} />
        <Stat label="Investors" value={data.totals.users.investor} />
        <Stat label="Brands" value={data.totals.brands} />
        <Stat label="Projects" value={data.totals.projects} />
      </div>

      {/* ===== TABLES (styled like the reference product table) ===== */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Recent active users */}
        <section className="card overflow-hidden">
          <header className="px-4 py-3 border-b bg-white">
            <h3 className="text-sm font-semibold">Recent active users</h3>
          </header>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th className="w-28">Role</th>
                  <th className="w-40">Last active</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-gray-500">
                      No recent activity.
                    </td>
                  </tr>
                ) : (
                  users.slice(0, 8).map((u, i) => (
                    <tr key={u.id} className="row">
                      <td className="text-gray-500">{i + 1}</td>
                      <td className="font-medium">{u.name}</td>
                      <td className="text-gray-600">{u.email}</td>
                      <td>
                        <span className="badge badge--info">{u.role}</span>
                      </td>
                      <td className="text-gray-600">{fmtDate(u.lastActive)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent brands (as “products”-style list) */}
        <section className="card overflow-hidden">
          <header className="px-4 py-3 border-b bg-white">
            <h3 className="text-sm font-semibold">Recent brands</h3>
          </header>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>Brand</th>
                  <th className="w-28">Items</th>
                  <th className="w-40">Last added</th>
                </tr>
              </thead>
              <tbody>
                {brands.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-gray-500">
                      No brands yet.
                    </td>
                  </tr>
                ) : (
                  brands.slice(0, 8).map((b, i) => (
                    <tr key={b.id} className="row">
                      <td className="text-gray-500">{i + 1}</td>
                      <td className="font-medium">{b.name}</td>
                      <td>
                        <span className="badge">{b.items} items</span>
                      </td>
                      <td className="text-gray-600">{fmtDate(b.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recently added projects */}
        <section className="card overflow-hidden">
          <header className="px-4 py-3 border-b bg-white">
            <h3 className="text-sm font-semibold">Recently added projects</h3>
          </header>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-10">#</th>
                  <th>Project</th>
                  <th>Creator</th>
                  <th className="w-40">Last modified</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-gray-500">
                      No recent projects.
                    </td>
                  </tr>
                ) : (
                  projects.slice(0, 8).map((p, i) => (
                    <tr key={p.id} className="row">
                      <td className="text-gray-500">{i + 1}</td>
                      <td className="font-medium">{p.title}</td>
                      <td className="text-gray-600">{p.creatorName}</td>
                      <td className="text-gray-600">{fmtDate(p.updatedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
