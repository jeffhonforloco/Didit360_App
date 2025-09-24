import { z } from "zod";
import { publicProcedure } from "../../../../create-context";

export const isStreamableProcedure = publicProcedure
  .input(
    z.object({
      entityType: z.enum([
        "track",
        "video",
        "artist",
        "release",
        "podcast",
        "episode",
        "audiobook",
        "book",
      ]),
      id: z.string(),
      country: z.string().length(2).transform((s) => s.toUpperCase()),
      atTime: z.string().datetime().optional(),
      explicitOk: z.boolean().default(true),
    })
  )
  .output(
    z.object({
      streamable: z.boolean(),
      reasons: z.array(z.string()).optional(),
    })
  )
  .query(async ({ input }) => {
    const reasons: string[] = [];

    // Placeholder gating logic (no DB yet)
    // Deny explicit content if explicitOk is false and entityType is audio-like
    if (!input.explicitOk && (input.entityType === "track" || input.entityType === "episode")) {
      reasons.push("explicit_not_allowed");
    }

    // Basic country allowlist example (allow all except 'KP')
    if (input.country === "KP") {
      reasons.push("country_blocked");
    }

    const streamable = reasons.length === 0;
    return { streamable, reasons: streamable ? undefined : reasons };
  });
