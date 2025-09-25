import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Enhanced ingest job with proper catalog integration
const IngestJobSchema = z.object({
  id: z.string(),
  source: z.string(),
  status: z.enum(['queued', 'processing', 'completed', 'failed']),
  entities_processed: z.number(),
  errors: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
});

// Mock job storage
const mockJobs = new Map<string, z.infer<typeof IngestJobSchema>>();

function generateJobId(): string {
  return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const ingestJobProcedure = publicProcedure
  .input(
    z.object({
      source: z.string(),
      data: z.any(),
      checksum: z.string().optional(),
      force: z.boolean().default(false),
    })
  )
  .output(
    z.object({
      job_id: z.string(),
      status: z.enum(['queued', 'processing', 'completed', 'failed']),
      entities_processed: z.number().optional(),
      errors: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[ingest] Starting ingest job for source: ${input.source}`);
    
    const jobId = generateJobId();
    const now = new Date().toISOString();
    
    // Create job record
    const job: z.infer<typeof IngestJobSchema> = {
      id: jobId,
      source: input.source,
      status: 'queued',
      entities_processed: 0,
      errors: [],
      created_at: now,
      updated_at: now,
    };
    
    mockJobs.set(jobId, job);
    
    // Simulate processing (in production this would be queued)
    setTimeout(async () => {
      try {
        console.log(`[ingest] Processing job: ${jobId}`);
        
        // Update job status
        job.status = 'processing';
        job.updated_at = new Date().toISOString();
        mockJobs.set(jobId, job);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock processing results
        const entitiesCount = Array.isArray(input.data) ? input.data.length : 1;
        
        job.status = 'completed';
        job.entities_processed = entitiesCount;
        job.updated_at = new Date().toISOString();
        mockJobs.set(jobId, job);
        
        console.log(`[ingest] Job completed: ${jobId}, processed ${entitiesCount} entities`);
      } catch (error) {
        console.error(`[ingest] Job failed: ${jobId}`, error);
        
        job.status = 'failed';
        job.errors = [error instanceof Error ? error.message : String(error)];
        job.updated_at = new Date().toISOString();
        mockJobs.set(jobId, job);
      }
    }, 100);
    
    return {
      job_id: jobId,
      status: job.status,
    };
  });

// Get job status procedure
export const getIngestJobProcedure = publicProcedure
  .input(z.object({ job_id: z.string() }))
  .output(IngestJobSchema.nullable())
  .query(async ({ input }) => {
    console.log(`[ingest] Getting job status: ${input.job_id}`);
    
    const job = mockJobs.get(input.job_id);
    if (!job) {
      console.log(`[ingest] Job not found: ${input.job_id}`);
      return null;
    }
    
    return job;
  });
