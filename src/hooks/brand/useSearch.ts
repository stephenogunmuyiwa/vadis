'use client';
import { useMemo, useState } from 'react';

export function useSearch<T>(items: T[], select: (x: T) => string) {
  const [q, setQ] = useState('');
  const result = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter(i => select(i).toLowerCase().includes(k));
  }, [items, q, select]);
  return { q, setQ, result };
}
