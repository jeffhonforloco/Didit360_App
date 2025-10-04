import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getPlaylistsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      userId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[playlists] Getting playlists", input);

    const mockPlaylists = [
      {
        id: "playlist-1",
        name: "My Favorites",
        description: "My favorite tracks",
        userId: "user-1",
        isPublic: true,
        trackCount: 25,
        duration: 5400000,
        coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "playlist-2",
        name: "Workout Mix",
        description: "High energy tracks for workouts",
        userId: "user-1",
        isPublic: true,
        trackCount: 30,
        duration: 7200000,
        coverImage: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "playlist-3",
        name: "Chill Vibes",
        description: "Relaxing music for studying",
        userId: "user-2",
        isPublic: true,
        trackCount: 40,
        duration: 9600000,
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const filteredPlaylists = input.userId
      ? mockPlaylists.filter((p) => p.userId === input.userId)
      : mockPlaylists;

    const paginatedPlaylists = filteredPlaylists.slice(
      input.offset,
      input.offset + input.limit
    );

    return {
      playlists: paginatedPlaylists,
      total: filteredPlaylists.length,
      limit: input.limit,
      offset: input.offset,
    };
  });
