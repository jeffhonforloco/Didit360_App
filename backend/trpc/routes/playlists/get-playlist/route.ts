import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getPlaylistProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log("[playlists] Getting playlist", input.id);

    const mockPlaylist = {
      id: input.id,
      name: "My Favorites",
      description: "My favorite tracks",
      userId: "user-1",
      isPublic: true,
      trackCount: 25,
      duration: 5400000,
      coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
      tracks: [
        {
          id: "track-1",
          title: "Sunset Dreams",
          artist: "Electronic Waves",
          duration: 240000,
          coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
          addedAt: new Date().toISOString(),
        },
        {
          id: "track-2",
          title: "Midnight City",
          artist: "Neon Lights",
          duration: 300000,
          coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
          addedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return mockPlaylist;
  });
