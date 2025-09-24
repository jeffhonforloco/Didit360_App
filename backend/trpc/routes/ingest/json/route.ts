import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const ingestJsonProcedure = publicProcedure
  .input(
    z.object({
      deliveryId: z.string(),
      profile: z.string().optional(),
      payload: z.record(z.string(), z.any()),
      checksum: z.string().optional(),
    })
  )
  .output(z.object({ jobId: z.string(), accepted: z.boolean() }))
  .mutation(async ({ input }) => {
    const jobId = `job_${Date.now()}`;
    console.log("ingest json", jobId, input.deliveryId);
    return { jobId, accepted: true };
  });
