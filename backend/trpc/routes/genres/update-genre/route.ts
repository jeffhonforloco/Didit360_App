import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const updateGenreProcedure = publicProcedure
  .input(
    z.object({
      genre_id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      color: z.string().optional(),
      parent_genre_ids: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[genres.updateGenre] Updating genre", input);

    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (input.name) {
      updates.name = input.name;
      updates.slug = input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    if (input.description !== undefined) {
      updates.description = input.description;
    }

    if (input.color) {
      updates.color = input.color;
    }

    return {
      success: true,
      genre_id: input.genre_id,
      updates,
    };
  });
