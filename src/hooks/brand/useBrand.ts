'use client';
import { useState } from 'react';
import type { Brand } from '@/types/brand/brand';

const BRANDS: Brand[] = [
  { id: 'apple', name: 'Apple Inc.' },
  { id: 'samsung', name: 'Samsung' },
  { id: 'disney', name: 'Disney' }
];

export function useBrand(initialId?: string) {
  const init = BRANDS.find(b => b.id === initialId) ?? BRANDS[0];
  const [brand, setBrand] = useState<Brand>(init);
  return { brand, setBrand, brands: BRANDS };
}
