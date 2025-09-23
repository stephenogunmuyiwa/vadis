// hooks/useTabs.ts
import { useState } from "react";

export function useTabs<T extends string>(initial: T) {
  const [active, setActive] = useState<T>(initial);
  return { active, setActive, is: (k: T) => active === k };
}
