import { useMemo } from 'react';
import { getDefaultCurrency } from '@/lib/currency';

export function useDefaultCurrency(): string {
  return useMemo(() => getDefaultCurrency(), []);
}
