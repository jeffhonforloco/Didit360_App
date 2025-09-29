import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const getAnalyticsInputSchema = z.object({
  period: z.enum(['24h', '7d', '30d', '90d', '1y']).default('7d'),
  metric: z.enum(['streams', 'users', 'revenue', 'engagement']).default('streams'),
});

const analyticsOutputSchema = z.object({
  keyMetrics: z.object({
    totalStreams: z.object({ value: z.string(), change: z.string() }),
    activeUsers: z.object({ value: z.string(), change: z.string() }),
    revenue: z.object({ value: z.string(), change: z.string() }),
    avgSession: z.object({ value: z.string(), change: z.string() }),
  }),
  contentPerformance: z.object({
    audioTracks: z.object({ count: z.string(), streams: z.string() }),
    videos: z.object({ count: z.string(), views: z.string() }),
    podcasts: z.object({ count: z.string(), listens: z.string() }),
    audiobooks: z.object({ count: z.string(), hours: z.string() }),
  }),
  geographic: z.array(z.object({
    country: z.string(),
    flag: z.string(),
    percentage: z.string(),
    users: z.string(),
  })),
  engagement: z.object({
    likes: z.string(),
    shares: z.string(),
    comments: z.string(),
    downloads: z.string(),
  }),
  topContent: z.array(z.object({
    rank: z.number(),
    title: z.string(),
    artist: z.string(),
    streams: z.string(),
  })),
  mixmind: z.object({
    sessions: z.string(),
    avgLength: z.string(),
    satisfaction: z.string(),
    totalListens: z.string(),
  }),
  revenue: z.array(z.object({
    source: z.string(),
    amount: z.string(),
    percentage: z.string(),
  })),
});

export const getAnalyticsProcedure = publicProcedure
  .input(getAnalyticsInputSchema)
  .output(analyticsOutputSchema)
  .query(async ({ input }) => {
    console.log('[Admin] Getting analytics for period:', input.period);
    
    // Mock data - replace with actual analytics queries
    return {
      keyMetrics: {
        totalStreams: { value: '847M', change: '+12.4% ↗' },
        activeUsers: { value: '2.4M', change: '+8.7% ↗' },
        revenue: { value: '$1.2M', change: '+15.2% ↗' },
        avgSession: { value: '4.2h', change: '+3.1% ↗' },
      },
      contentPerformance: {
        audioTracks: { count: '1.2M', streams: '847M streams' },
        videos: { count: '340K', views: '234M views' },
        podcasts: { count: '89K', listens: '45M listens' },
        audiobooks: { count: '45K', hours: '12M hours' },
      },
      geographic: [
        { country: 'United States', flag: '🇺🇸', percentage: '28.4%', users: '680K users' },
        { country: 'United Kingdom', flag: '🇬🇧', percentage: '15.2%', users: '365K users' },
        { country: 'Canada', flag: '🇨🇦', percentage: '12.8%', users: '307K users' },
        { country: 'Australia', flag: '🇦🇺', percentage: '9.6%', users: '230K users' },
        { country: 'Germany', flag: '🇩🇪', percentage: '8.3%', users: '199K users' },
      ],
      engagement: {
        likes: '12.4M',
        shares: '3.2M',
        comments: '890K',
        downloads: '567K',
      },
      topContent: [
        { rank: 1, title: 'Midnight Dreams', artist: 'Luna Rodriguez', streams: '2.4M streams' },
        { rank: 2, title: 'Electric Nights', artist: 'Neon Pulse', streams: '1.8M streams' },
        { rank: 3, title: 'Ocean Waves', artist: 'Calm Sounds', streams: '1.5M streams' },
      ],
      mixmind: {
        sessions: '12.8K',
        avgLength: '4.2h',
        satisfaction: '89%',
        totalListens: '234K',
      },
      revenue: [
        { source: 'Premium Subscriptions', amount: '$847K', percentage: '68%' },
        { source: 'Advertising', amount: '$234K', percentage: '19%' },
        { source: 'Creator Tips', amount: '$89K', percentage: '7%' },
        { source: 'Merchandise', amount: '$45K', percentage: '4%' },
        { source: 'Other', amount: '$23K', percentage: '2%' },
      ],
    };
  });