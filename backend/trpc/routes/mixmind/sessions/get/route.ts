import { z } from "zod";
import { publicProcedure } from "../../../../create-context";

export const mixmindGetSessionProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(
    z.object({
      id: z.string(),
      tracks: z.array(
        z.object({ id: z.string(), startMs: z.number(), endMs: z.number() })
      ),
    })
  )
  .query(async ({ input }) => {
    return { id: input.id, tracks: [] };
  });
