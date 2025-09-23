"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

type Option = { label: string; value: string };

type Props = {
  value?: string;
  onChange?: (val: string) => void;
  options: Option[];
  placeholder?: string;
};

export default function Select({
  value,
  onChange,
  options,
  placeholder,
}: Props) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full appearance-none rounded-xl border border-neutral-300 bg-white px-3 py-2 pr-9 text-sm text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
      />
    </div>
  );
}
