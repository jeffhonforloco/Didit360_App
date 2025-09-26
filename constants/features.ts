export const features = {
  liveDJ: {
    enabled: true,
  },
} as const;

export type Features = typeof features;
