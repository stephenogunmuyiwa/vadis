"use client";
import { useState, FormEvent } from "react";
import { toast } from "sonner";
import { requestDemo } from "@/app/api/shared/login/requestDemo";
import type { RequestDemoPayload } from "@/types/login/requestDemo";

type Props = {
  onShowSignIn?: () => void;
};

export default function RequestDemoForm({ onShowSignIn }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [org, setOrg] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: RequestDemoPayload = {
      firstName,
      lastName,
      org,
      email,
      region,
      role,
      phone,
    };

    try {
      const res = await requestDemo(payload);
      if (res.ok) {
        toast.success("Request submitted successfully");
        setDone(true);
      } else {
        const msg = res.error || "Something went wrong. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = "Network error. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white p-8 ring-1 ring-neutral-200 border border-gray-300">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-neutral-900">
            Request received 🎉
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Thanks, {firstName}! We’ll reach out at{" "}
            <span className="font-medium">{email}</span> shortly.
          </p>
        </div>
        <button
          onClick={onShowSignIn}
          className="mt-2 w-full rounded-xl bg-violet-600 px-4 py-4 text-center text-sm font-medium text-white transition hover:bg-violet-700"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 ring-1 ring-neutral-200 border border-gray-300">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-semibold text-neutral-900">
          Request a Demo
        </h2>
        <p className="mt-1 text-sm text-neutral-600">
          Tell us a bit about you and we’ll get in touch.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-xs text-neutral-600"
            >
              First name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
              placeholder="Jane"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-xs text-neutral-600"
            >
              Last name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="org" className="mb-1 block text-xs text-neutral-600">
            Organization
          </label>
          <input
            id="org"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
            placeholder="Vadis Pictures"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-xs text-neutral-600"
          >
            Work email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
            placeholder="jane@company.com"
          />
        </div>
        <div>
          <label htmlFor="role" className="mb-1 block text-xs text-neutral-600">
            What best describes what you do
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="" disabled>
              Select a role
            </option>
            <option>Production Company</option>
            <option>Brand/Advertiser</option>
            <option>Individual Creator</option>
            <option>Film Investor</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="region"
              className="mb-1 block text-xs text-neutral-600"
            >
              Region
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            >
              <option value="" disabled>
                Select a region
              </option>
              <option>North America</option>
              <option>Europe</option>
              <option>UK & Ireland</option>
              <option>Middle East</option>
              <option>APAC</option>
              <option>LATAM</option>
              <option>Africa</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-xs text-neutral-600"
            >
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="tel"
              value={phone}
              required
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-violet-500"
              placeholder="+31 6 1234 5678"
            />
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
          {loading ? "Submitting…" : "Request Demo"}
        </button>

        <p className="mt-3 text-center text-xs text-neutral-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onShowSignIn}
            className="underline underline-offset-2 text-violet-600"
          >
            Sign in
          </button>
        </p>
      </form>
    </div>
  );
}
