import { z } from "zod";
import { publicProcedure } from "../../../../create-context";

export const mixmindCreateSessionProcedure = publicProcedure
  .input(
    z.object({
      seed: z.array(z.string()).optional(),
      mood: z.string().optional(),
      tempoTarget: z.number().optional(),
      limit: z.number().int().min(1).max(100).default(20),
    })
  )
  .output(
    z.object({
      id: z.string(),
      tracks: z.array(
        z.object({ id: z.string(), startMs: z.number(), endMs: z.number() })
      ),
    })
  )
  .mutation(async ({ input }) => {
    const id = `mix_${Date.now()}`;
    console.log("mixmind create", id, input);
    return { id, tracks: [] };
  });
