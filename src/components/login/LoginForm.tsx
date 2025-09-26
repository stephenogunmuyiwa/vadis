"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";

type Props = {
  onShowRequestDemo?: () => void;
};

export default function LoginForm({ onShowRequestDemo }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login({ email, password });

    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Invalid email or password");
      return;
    }

    const role = res.user.role;
    router.replace(`/${role}`);
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 ring-1 ring-neutral-200 border border-gray-300">
      <div className="mb-16 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">Sign In</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Enter your credentials to access your account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs text-neutral-600"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="eg. johnfrans@gmail.com"
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-xs text-neutral-600"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 pr-10 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 grid w-10 place-content-center text-neutral-400">
              •••
            </span>
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-red-100 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-violet-600 px-4 py-4 text-center text-sm font-medium text-white transition enabled:hover:bg-violet-700 disabled:opacity-70"
        >
          {loading ? "Signing In…" : "Sign In"}
        </button>

        <p className="mt-3 text-center text-xs text-neutral-600">
          Don't have an account?{" "}
          <a
            onClick={onShowRequestDemo}
            className="underline underline-offset-2 text-violet-600"
          >
            Request Demo
          </a>
        </p>
      </form>
    </div>
  );
}
