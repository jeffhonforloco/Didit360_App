import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const dashboardStatsOutputSchema = z.object({
  platform: z.object({
    activeUsers: z.string(),
    tracks: z.string(),
    videos: z.string(),
    podcasts: z.string(),
  }),
  content: z.object({
    dailyStreams: z.string(),
    newUploads: z.string(),
    pendingModeration: z.string(),
    liveStreams: z.string(),
  }),
  revenue: z.object({
    monthly: z.object({ value: z.string(), change: z.string() }),
    payouts: z.object({ value: z.string(), change: z.string() }),
  }),
  security: z.object({
    complianceScore: z.string(),
    activeControls: z.string(),
    openFindings: z.string(),
    criticalIssues: z.string(),
  }),
  frameworks: z.array(z.object({
    name: z.string(),
    score: z.string(),
    color: z.string(),
  })),
  controls: z.object({
    passing: z.number(),
    failing: z.number(),
    skipped: z.number(),
  }),
  vendors: z.object({
    lowRisk: z.number(),
    mediumRisk: z.number(),
    highRisk: z.number(),
  }),
  recentEvidence: z.array(z.object({
    text: z.string(),
    time: z.string(),
    color: z.string(),
  })),
  openFindings: z.array(z.object({
    text: z.string(),
    age: z.string(),
    severity: z.enum(['critical', 'high', 'medium', 'low']),
  })),
  upcomingAudits: z.array(z.object({
    text: z.string(),
    date: z.string(),
    color: z.string(),
  })),
});

export const getDashboardStatsProcedure = publicProcedure
  .output(dashboardStatsOutputSchema)
  .query(async () => {
    console.log('[Admin] Getting dashboard stats');
    
    // Mock data - replace with actual database queries
    return {
      platform: {
        activeUsers: '2.4M',
        tracks: '847K',
        videos: '124K',
        podcasts: '45K',
      },
      content: {
        dailyStreams: '12.4M',
        newUploads: '2,847',
        pendingModeration: '156',
        liveStreams: '89',
      },
      revenue: {
        monthly: { value: '$847K', change: '+12.4%' },
        payouts: { value: '$234K', change: '+8.7%' },
      },
      security: {
        complianceScore: '87%',
        activeControls: '342',
        openFindings: '23',
        criticalIssues: '7',
      },
      frameworks: [
        { name: 'SOC 2 Type II', score: '94%', color: '#22c55e' },
        { name: 'ISO 27001', score: '89%', color: '#3b82f6' },
        { name: 'HIPAA Security Rule', score: '76%', color: '#f59e0b' },
        { name: 'GDPR', score: '82%', color: '#8b5cf6' },
      ],
      controls: {
        passing: 240,
        failing: 52,
        skipped: 50,
      },
      vendors: {
        lowRisk: 47,
        mediumRisk: 23,
        highRisk: 8,
      },
      recentEvidence: [
        { text: 'AWS CloudTrail logs uploaded', time: '5m ago', color: '#22c55e' },
        { text: 'SOC 2 audit report attached', time: '1h ago', color: '#3b82f6' },
        { text: 'Penetration test results', time: '3h ago', color: '#f59e0b' },
      ],
      openFindings: [
        { text: 'MFA not enforced for admin accounts', age: '2d', severity: 'critical' as const },
        { text: 'Encryption at rest not configured', age: '5d', severity: 'high' as const },
        { text: 'Access logs retention policy missing', age: '1w', severity: 'critical' as const },
      ],
      upcomingAudits: [
        { text: 'SOC 2 Type II audit renewal', date: 'Mar 15', color: '#f59e0b' },
        { text: 'ISO 27001 certificate expiry', date: 'Jun 30', color: '#3b82f6' },
        { text: 'Quarterly security review', date: 'Apr 1', color: '#22c55e' },
      ],
    };
  });