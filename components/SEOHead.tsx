import React from 'react';
import { Platform } from 'react-native';
import type { SEOConfig } from '@/lib/seo';
import { useSEO } from '@/hooks/useSEO';

interface SEOHeadProps extends Partial<SEOConfig> {
  children?: React.ReactNode;
}

export function SEOHead({ children, ...config }: SEOHeadProps) {
  useSEO(config);

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function PageSEO(props: Partial<SEOConfig>) {
  useSEO(props);
  return null;
}
