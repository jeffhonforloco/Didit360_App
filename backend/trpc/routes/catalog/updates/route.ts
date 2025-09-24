import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const UpdateItemSchema = z.object({
  id: z.string(),
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
  action: z.enum(["upsert", "delete"]),
  updatedAt: z.string(),
});

export const updatesProcedure = publicProcedure
  .input(
    z.object({
      since: z.string().optional(),
      until: z.string().optional(),
      limit: z.number().int().min(1).max(500).optional(),
    })
  )
  .output(z.array(UpdateItemSchema))
  .query(async () => {
    return [];
  });
