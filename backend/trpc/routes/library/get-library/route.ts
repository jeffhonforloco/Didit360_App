import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const LibrarySchema = z.object({
  playlists: z.array(z.object({
    id: z.string(),
    name: z.string(),
    tracks: z.array(z.any()),
    createdAt: z.string(),
  })),
  favorites: z.array(z.any()),
  downloads: z.array(z.any()),
  recentlyPlayed: z.array(z.any()),
});

export const getLibraryProcedure = publicProcedure
  .input(z.object({
    userId: z.string(),
  }))
  .output(LibrarySchema)
  .query(async ({ input }) => {
    // In a real app, this would fetch from a database
    // For now, return empty library structure
    return {
      playlists: [],
      favorites: [],
      downloads: [],
      recentlyPlayed: [],
    };
  });