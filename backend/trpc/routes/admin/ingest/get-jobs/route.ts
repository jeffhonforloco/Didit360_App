import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const getIngestJobsInputSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'paused']).optional(),
  type: z.enum(['ddex', 'json', 'rss', 'manual']).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

const ingestJobSchema = z.object({
  id: z.string(),
  type: z.enum(['ddex', 'json', 'rss', 'manual']),
  source: z.string(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'paused']),
  progress: z.number(),
  itemsTotal: z.number(),
  itemsProcessed: z.number(),
  itemsFailed: z.number(),
  startedAt: z.string(),
  estimatedCompletion: z.string().optional(),
  errorMessage: z.string().optional(),
});

const getIngestJobsOutputSchema = z.object({
  jobs: z.array(ingestJobSchema),
  total: z.number(),
  hasMore: z.boolean(),
  stats: z.object({
    totalIngested: z.string(),
    successRate: z.string(),
    activeJobs: z.number(),
    failedItems: z.number(),
  }),
});

// Mock data - replace with actual database queries
const mockJobs = [
  {
    id: '1',
    type: 'ddex' as const,
    source: 'Universal Music Group',
    status: 'processing' as const,
    progress: 67,
    itemsTotal: 1500,
    itemsProcessed: 1005,
    itemsFailed: 12,
    startedAt: '2024-01-15T10:30:00Z',
    estimatedCompletion: '2024-01-15T12:45:00Z'
  },
  {
    id: '2',
    type: 'rss' as const,
    source: 'Podcast Network RSS',
    status: 'completed' as const,
    progress: 100,
    itemsTotal: 234,
    itemsProcessed: 234,
    itemsFailed: 0,
    startedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    type: 'json' as const,
    source: 'Independent Artists Batch',
    status: 'failed' as const,
    progress: 23,
    itemsTotal: 89,
    itemsProcessed: 20,
    itemsFailed: 69,
    startedAt: '2024-01-15T08:15:00Z',
    errorMessage: 'Invalid metadata format in batch items 21-89'
  },
  {
    id: '4',
    type: 'manual' as const,
    source: 'Admin Upload',
    status: 'pending' as const,
    progress: 0,
    itemsTotal: 45,
    itemsProcessed: 0,
    itemsFailed: 0,
    startedAt: '2024-01-15T11:00:00Z'
  }
];

export const getIngestJobsProcedure = publicProcedure
  .input(getIngestJobsInputSchema)
  .output(getIngestJobsOutputSchema)
  .query(async ({ input }) => {
    console.log('[Admin] Getting ingest jobs with filters:', input);
    
    let filteredJobs = mockJobs;
    
    // Apply status filter
    if (input.status) {
      filteredJobs = filteredJobs.filter(job => job.status === input.status);
    }
    
    // Apply type filter
    if (input.type) {
      filteredJobs = filteredJobs.filter(job => job.type === input.type);
    }
    
    const total = filteredJobs.length;
    const paginatedJobs = filteredJobs.slice(input.offset, input.offset + input.limit);
    const hasMore = input.offset + input.limit < total;
    
    return {
      jobs: paginatedJobs,
      total,
      hasMore,
      stats: {
        totalIngested: '1.2M',
        successRate: '98.7%',
        activeJobs: filteredJobs.filter(j => j.status === 'processing' || j.status === 'pending').length,
        failedItems: filteredJobs.reduce((sum, j) => sum + j.itemsFailed, 0),
      },
    };
  });