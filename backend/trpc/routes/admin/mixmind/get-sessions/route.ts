import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const getMixMindSessionsInputSchema = z.object({
  status: z.enum(['active', 'completed', 'failed']).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

const mixMindSessionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(['active', 'completed', 'failed']),
  duration: z.number(),
  tracksCount: z.number(),
  satisfaction: z.number(),
  createdAt: z.string(),
});

const getMixMindSessionsOutputSchema = z.object({
  sessions: z.array(mixMindSessionSchema),
  total: z.number(),
  hasMore: z.boolean(),
  stats: z.object({
    sessionsToday: z.string(),
    activeUsers: z.string(),
    avgSession: z.string(),
    satisfaction: z.string(),
  }),
});

// Mock data - replace with actual database queries
const mockSessions = [
  { id: '1', userId: 'user123', status: 'active' as const, duration: 3600, tracksCount: 15, satisfaction: 4.8, createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', userId: 'user456', status: 'completed' as const, duration: 2400, tracksCount: 12, satisfaction: 4.2, createdAt: '2024-01-15T09:15:00Z' },
  { id: '3', userId: 'user789', status: 'completed' as const, duration: 4200, tracksCount: 18, satisfaction: 4.9, createdAt: '2024-01-15T08:45:00Z' },
  { id: '4', userId: 'user101', status: 'failed' as const, duration: 0, tracksCount: 0, satisfaction: 0, createdAt: '2024-01-15T08:00:00Z' },
  { id: '5', userId: 'user202', status: 'active' as const, duration: 1800, tracksCount: 8, satisfaction: 4.5, createdAt: '2024-01-15T11:15:00Z' },
];

export const getMixMindSessionsProcedure = publicProcedure
  .input(getMixMindSessionsInputSchema)
  .output(getMixMindSessionsOutputSchema)
  .query(async ({ input }) => {
    console.log('[Admin] Getting MixMind sessions with filters:', input);
    
    let filteredSessions = mockSessions;
    
    // Apply status filter
    if (input.status) {
      filteredSessions = filteredSessions.filter(session => session.status === input.status);
    }
    
    const total = filteredSessions.length;
    const paginatedSessions = filteredSessions.slice(input.offset, input.offset + input.limit);
    const hasMore = input.offset + input.limit < total;
    
    return {
      sessions: paginatedSessions,
      total,
      hasMore,
      stats: {
        sessionsToday: '12.8K',
        activeUsers: '8.4K',
        avgSession: '4.2h',
        satisfaction: '89%',
      },
    };
  });