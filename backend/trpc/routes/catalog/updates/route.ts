import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { getMockUpdateEvents } from "@/backend/trpc/util/catalog-mock";

const UpdateEventSchema = z.object({
  op: z.enum(["upsert", "delete"]),
  entity: z.enum([
    "track",
    "video",
    "artist",
    "release",
    "podcast",
    "episode",
    "audiobook",
    "book",
    "image",
  ]),
  id: z.string(),
  version: z.number().int().min(1),
  updated_at: z.string(),
});

export const updatesProcedure = publicProcedure
  .input(
    z.object({
      since: z.string().optional(),
      until: z.string().optional(),
      limit: z.number().int().min(1).max(500).optional(),
    })
  )
  .output(
    z.object({
      since: z.string(),
      until: z.string(),
      events: z.array(UpdateEventSchema),
      next_since: z.string(),
    })
  )
  .query(async ({ input }) => {
    const nowIso = new Date().toISOString();
    const since = input.since ?? new Date(Date.now() - 3600_000).toISOString();
    const until = input.until ?? nowIso;
    const limit = input.limit ?? 500;

    const events = getMockUpdateEvents({ since, until, limit });

    return {
      since,
      until,
      events,
      next_since: until,
    };
  });
