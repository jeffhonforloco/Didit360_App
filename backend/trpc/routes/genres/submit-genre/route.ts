import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const submitGenreProcedure = publicProcedure
  .input(
    z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      parent_genre_ids: z.array(z.string()).optional(),
      submitted_by: z.string().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[genres.submitGenre] Submitting new genre", input);

    const slug = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const genre = {
      id: `user-${Date.now()}`,
      name: input.name,
      slug,
      description: input.description || "",
      color: "#6366F1",
      parent_genre_id: input.parent_genre_ids?.[0] || null,
      is_approved: false,
      is_system: false,
      submitted_by: input.submitted_by || "anonymous",
      submitted_at: new Date().toISOString(),
      approved_by: null,
      approved_at: null,
      track_count: 0,
      artist_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("[genres.submitGenre] Genre submitted for approval", genre);

    return {
      success: true,
      genre,
      message: "Genre submitted for approval. It will appear once approved by moderators.",
    };
  });
