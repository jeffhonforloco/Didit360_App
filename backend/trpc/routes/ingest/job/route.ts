import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const ingestJobProcedure = publicProcedure
  .input(z.object({ jobId: z.string() }))
  .output(
    z.object({
      jobId: z.string(),
      status: z.enum(["queued", "processing", "completed", "failed"]),
      error: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    return { jobId: input.jobId, status: "queued" };
  });
