"use client";

import * as React from "react";
import clsx from "clsx";

export default function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      rows={6}
      className={clsx(
        "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800",
        "placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      )}
      {...props}
    />
  );
}
