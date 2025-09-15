// src/components/admin/SettingsPanel.tsx
"use client";

export default function SettingsPanel() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3">Access & security</h3>
        <div className="space-y-3 text-sm">
          {[
            "Maintenance mode",
            "Allow self-signup (creators)",
            "Require strong passwords",
          ].map((l) => (
            <label key={l} className="flex items-center justify-between">
              <span>{l}</span>
              <div role="switch" className="switch" data-on="false">
                <span className="switch__dot" />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-semibold mb-3">Integrations</h3>
        <ul className="text-sm space-y-2">
          <li className="flex items-center justify-between">
            <span>Email provider</span>
            <span className="badge badge--good">Healthy</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Storage</span>
            <span className="text-xs text-gray-500">42% used</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Rate limit</span>
            <span className="text-xs text-gray-500">OK</span>
          </li>
        </ul>
      </div>

      <div className="card p-4 lg:col-span-2">
        <h3 className="text-sm font-semibold mb-3">Data</h3>
        <div className="flex gap-2">
          <button className="btn">Export users (CSV)</button>
          <button className="btn">Export projects (CSV)</button>
          <button className="btn">Purge caches</button>
        </div>
      </div>
    </div>
  );
}
