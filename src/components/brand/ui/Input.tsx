"use client";
import { InputHTMLAttributes } from "react";
import { cn } from "@/lib/brand/cn";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-400",
        props.className
      )}
    />
  );
}
