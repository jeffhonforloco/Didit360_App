import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export const ingestJsonProcedure = publicProcedure
  .input(
    z.object({
      deliveryId: z.string(),
      profile: z.string().optional(),
      payload: z.record(z.string(), z.any()),
      checksum: z.string().optional(),
      entityType: z.string().default('release'),
      operation: z.enum(['create', 'update', 'delete']).default('create'),
    })
  )
  .output(z.object({ jobId: z.string(), accepted: z.boolean() }))
  .mutation(async ({ input }) => {
    console.log(`[ingest] JSON ingest: ${input.deliveryId} (${input.entityType})`);
    
    try {
      // Mock job creation
      const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      
      console.log(`[ingest] Created mock job ${jobId} for ${input.deliveryId}`);
      
      return { jobId, accepted: true };
    } catch (error) {
      console.error(`[ingest] Failed to create job:`, error);
      return { jobId: '', accepted: false };
    }
  });
