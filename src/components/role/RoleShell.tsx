"use client";
import { Role } from "@/types/session";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/api";

export default function RoleShell({ role }: { role: Role }) {
  const router = useRouter();
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold capitalize">{role} dashboard</h1>
        <button
          onClick={async () => {
            await logout();
            router.replace("/");
          }}
          className="rounded-xl border border-white/10 bg-neutral-900 px-3 py-2 text-sm hover:bg-neutral-800"
        >
          Log out
        </button>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
          <h3 className="mb-2 text-lg font-medium">Welcome back 👋</h3>
          <p className="text-neutral-400">
            You\'re signed in with role{" "}
            <span className="font-semibold">{role}</span>.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-6">
          <h3 className="mb-2 text-lg font-medium">Quick Links</h3>
          <ul className="list-inside list-disc text-neutral-400">
            <li>Replace this with your {role} home content.</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
