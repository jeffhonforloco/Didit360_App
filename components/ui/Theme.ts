import { useMemo } from 'react';
import { palette } from '@/constants/tokens';
import { useUX } from '@/contexts/UXContext';

export function useTheme() {
  const { ux } = useUX();
  const scheme = ux.theme === 'dark' ? 'dark' : 'light';
  const colors = useMemo(() => palette[scheme], [scheme]);
  return { scheme, colors } as const;
}
