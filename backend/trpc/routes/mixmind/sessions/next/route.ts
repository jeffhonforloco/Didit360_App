import { z } from "zod";
import { publicProcedure } from "../../../../create-context";

export const mixmindNextProcedure = publicProcedure
  .input(z.object({ id: z.string(), limit: z.number().int().min(1).max(50).default(10) }))
  .output(
    z.object({
      id: z.string(),
      tracks: z.array(
        z.object({ id: z.string(), startMs: z.number(), endMs: z.number() })
      ),
    })
  )
  .mutation(async ({ input }) => {
    console.log("mixmind next", input.id);
    return { id: input.id, tracks: [] };
  });
