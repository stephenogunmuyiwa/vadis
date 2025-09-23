"use client";

import * as React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition-colors " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4",
  };
  const variants = {
    primary:
      "bg-[#383fff] text-white hover:bg-indigo-600/90 focus:ring-indigo-600",
    ghost: "bg-transparent hover:bg-neutral-100 text-neutral-700",
    outline:
      "border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700",
  };
  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
