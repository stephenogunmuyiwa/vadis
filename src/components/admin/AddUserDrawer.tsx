// src/components/admin/AddUserDrawer.tsx
"use client";
import { useState } from "react";
import type { Role } from "@/types/admin";

export default function AddUserDrawer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: {
    name?: string;
    email: string;
    password: string;
    role: Role;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("creator");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
    >
      {/* Scrim */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-[380px] bg-white border-l p-4 transition-transform
                    ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Add user</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Close
          </button>
        </div>

        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            await onSubmit({ name: name || undefined, email, password, role });
            setSubmitting(false);
            onClose();
          }}
        >
          <label className="block text-xs text-gray-600">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-2 text-sm"
          />

          <label className="block text-xs text-gray-600">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-2 text-sm"
          />

          <label className="block text-xs text-gray-600">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-2 text-sm"
          />

          <label className="block text-xs text-gray-600">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="w-full rounded-lg border p-2 text-sm"
          >
            <option value="production">Production</option>
            <option value="creator">Creator</option>
            <option value="investor">Investor</option>
            <option value="brand">Brand</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gray-900 text-white py-2 text-sm mt-2 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create user"}
          </button>
        </form>
      </div>
    </div>
  );
}
