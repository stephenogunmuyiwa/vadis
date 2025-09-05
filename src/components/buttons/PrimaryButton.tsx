"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "light" | "dark" | "ai";
type Size = "sm" | "md" | "lg" | "xl";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

export function PrimaryButton({
  children,
  className = "",
  variant = "light",
  size = "md",
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  ...props
}: PrimaryButtonProps) {
  const base = [
    "inline-flex items-center justify-center gap-2 rounded-full font-medium",
    "transition active:scale-[0.985]",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
    "relative", // for glow/highlight layers in ai variant
  ];

  const sizes: Record<Size, string> = {
    sm: "px-4 h-9 text-sm",
    md: "px-5 h-10 text-sm",
    lg: "px-6 h-12 text-base",
    xl: "px-8 h-14 text-[17px]",
  };

  // visual styles
  const variants: Record<Variant, string> = {
    // frosted light
    light: [
      "text-white",
      "bg-gray-500/90 border border-white/40 backdrop-blur",
      "hover:bg-gray-600/90",
      "focus-visible:ring-white/40",
      "shadow-lg hover:shadow-xl",
    ].join(" "),

    // frosted dark
    dark: [
      "text-white",
      "bg-white/10 border border-white/20 backdrop-blur",
      "hover:bg-white/15",
      "focus-visible:ring-white/30",
      "shadow-lg hover:shadow-xl",
    ].join(" "),

    // NEW: AI gradient button (matches the reference look)
    ai: [
      "text-white",
      // rich purple gradient fill
      "bg-gradient-to-br from-[#fa3a45] via-[#e23bbc] to-[#fa5d30]",
      // thin translucent ring (the “inner outline”)
      "ring-1 ring-white/20",
      // no regular border (gradient edge looks cleaner)
      "border-[2px]",
      // soft outer glow
      "hover:brightness-[1.03]",
      // highlight sheen (top light) using ::after
      "after:content-[''] after:absolute after:inset-0 after:rounded-full",
      "after:pointer-events-none after:bg-[radial-gradient(75%_60%_at_50%_0%,rgba(255,255,255,0.35),rgba(255,255,255,0)_60%)]",
      // subtle halo (outside glow) using ::before
      "before:content-[''] before:absolute before:-inset-1 before:rounded-full before:blur-xl",
      "before:bg-[conic-gradient(from_180deg_at_50%_50%,rgba(167,139,250,0.35),rgba(96,165,250,0.2),rgba(34,197,94,0.2),rgba(167,139,250,0.35))]",
    ].join(" "),
  };

  if (fullWidth) base.push("w-full");

  const classes = [...base, sizes[size], variants[variant], className].join(
    " "
  );

  return (
    <button {...props} className={classes}>
      {leadingIcon && <span className="shrink-0">{leadingIcon}</span>}
      <span className="font-semibold tracking-wide">{children}</span>
      {trailingIcon && <span className="shrink-0">{trailingIcon}</span>}
    </button>
  );
}
