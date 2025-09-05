// utils/initials.ts
export const initials = (n: string) =>
  n
    .trim()
    .split(/\s+/)
    .map((s) => s[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
