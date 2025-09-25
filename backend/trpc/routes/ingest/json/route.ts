import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { ingestService } from "@/backend/services/ingest";

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
      const job = await ingestService.createJob(
        'json',
        input.deliveryId,
        input.entityType,
        input.operation,
        input.payload,
        input.checksum
      );
      
      // Process job immediately for demo
      await ingestService.processJob(job.id);
      
      return { jobId: job.id, accepted: true };
    } catch (error) {
      console.error(`[ingest] Failed to create job:`, error);
      return { jobId: '', accepted: false };
    }
  });
