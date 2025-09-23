"use client";
import { cn } from "@/lib/brand/cn";
import { ButtonHTMLAttributes, forwardRef } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md";
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  }[size];
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    ghost: "bg-transparent hover:bg-zinc-100 text-zinc-900",
    outline: "border border-zinc-300 hover:bg-zinc-50",
  }[variant];

  return (
    <button
      ref={ref}
      className={cn(base, sizes, variants, className)}
      {...props}
    />
  );
});
