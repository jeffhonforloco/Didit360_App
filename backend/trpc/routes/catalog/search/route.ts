import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const SearchItemSchema = z.object({
  id: z.string(),
  type: z.enum([
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
  title: z.string(),
  subtitle: z.string().optional(),
  artwork: z.string().url().optional(),
});

export const searchProcedure = publicProcedure
  .input(
    z.object({
      q: z.string().min(1),
      type: z
        .enum([
          "track",
          "video",
          "artist",
          "release",
          "podcast",
          "episode",
          "audiobook",
          "book",
          "image",
          "all",
        ])
        .default("all"),
      limit: z.number().int().min(1).max(50).default(20),
    })
  )
  .output(z.array(SearchItemSchema))
  .query(async ({ input }) => {
    console.log("search query", input);
    return [];
  });
