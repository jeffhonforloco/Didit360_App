import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const ingestRssProcedure = publicProcedure
  .input(
    z.object({
      feedUrl: z.string().url(),
      deliveryId: z.string().optional(),
    })
  )
  .output(z.object({ jobId: z.string(), accepted: z.boolean() }))
  .mutation(async ({ input }) => {
    const jobId = `job_${Date.now()}`;
    console.log("ingest rss", jobId, input.feedUrl);
    return { jobId, accepted: true };
  });
