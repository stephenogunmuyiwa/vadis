"use client";

import { useCallback, useState } from "react";

export function useRightSheet<T extends string>() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<T | null>(null);

  const show = useCallback((m: T) => {
    setMode(m);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    setMode(null);
  }, []);

  return { open, mode, show, hide };
}
