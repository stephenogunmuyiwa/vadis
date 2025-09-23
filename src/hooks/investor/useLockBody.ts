// hooks/useLockBody.ts
import { useLayoutEffect } from "react";

export const useLockBody = (locked: boolean) => {
  useLayoutEffect(() => {
    if (!locked) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => void (document.body.style.overflow = original);
  }, [locked]);
};
