import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getTracksProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      genre: z.string().optional(),
      artistId: z.string().optional(),
      albumId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[tracks] Getting tracks", input);

    const mockTracks = [
      {
        id: "track-1",
        title: "Sunset Dreams",
        artistId: "artist-1",
        artistName: "Electronic Waves",
        albumId: "album-1",
        albumName: "Neon Nights",
        duration: 240000,
        genre: "Electronic",
        explicit: false,
        isrc: "USRC12345678",
        releaseDate: "2024-01-15",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        popularity: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-2",
        title: "Midnight City",
        artistId: "artist-2",
        artistName: "Neon Lights",
        albumId: "album-2",
        albumName: "Urban Dreams",
        duration: 300000,
        genre: "Synthwave",
        explicit: false,
        isrc: "USRC87654321",
        releaseDate: "2024-02-20",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        popularity: 92,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-3",
        title: "Ocean Waves",
        artistId: "artist-3",
        artistName: "Ambient Collective",
        albumId: "album-3",
        albumName: "Nature Sounds",
        duration: 360000,
        genre: "Ambient",
        explicit: false,
        isrc: "USRC11223344",
        releaseDate: "2024-03-10",
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        popularity: 78,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-4",
        title: "Cosmic Journey",
        artistId: "artist-4",
        artistName: "Space Voyager",
        albumId: "album-4",
        albumName: "Interstellar",
        duration: 280000,
        genre: "Electronic",
        explicit: false,
        isrc: "USRC22334455",
        releaseDate: "2024-01-20",
        coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        popularity: 88,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-5",
        title: "Tokyo Nights",
        artistId: "artist-5",
        artistName: "Urban Echo",
        albumId: "album-5",
        albumName: "City Lights",
        duration: 195000,
        genre: "Synthwave",
        explicit: false,
        isrc: "USRC33445566",
        releaseDate: "2024-02-05",
        coverImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        popularity: 90,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-6",
        title: "Desert Storm",
        artistId: "artist-6",
        artistName: "Sandstorm",
        albumId: "album-6",
        albumName: "Dunes",
        duration: 235000,
        genre: "Rock",
        explicit: false,
        isrc: "USRC44556677",
        releaseDate: "2024-03-01",
        coverImage: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        popularity: 82,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-7",
        title: "Mountain Peak",
        artistId: "artist-7",
        artistName: "Alpine Sound",
        albumId: "album-7",
        albumName: "Summit",
        duration: 265000,
        genre: "Ambient",
        explicit: false,
        isrc: "USRC55667788",
        releaseDate: "2024-01-10",
        coverImage: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        popularity: 76,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-8",
        title: "Neon Dreams",
        artistId: "artist-8",
        artistName: "Synthwave Collective",
        albumId: "album-8",
        albumName: "Retro Future",
        duration: 245000,
        genre: "Synthwave",
        explicit: false,
        isrc: "USRC66778899",
        releaseDate: "2024-02-15",
        coverImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        previewUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        popularity: 94,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filteredTracks = mockTracks;

    if (input.genre) {
      filteredTracks = filteredTracks.filter((t) => t.genre === input.genre);
    }
    if (input.artistId) {
      filteredTracks = filteredTracks.filter((t) => t.artistId === input.artistId);
    }
    if (input.albumId) {
      filteredTracks = filteredTracks.filter((t) => t.albumId === input.albumId);
    }

    const paginatedTracks = filteredTracks.slice(
      input.offset,
      input.offset + input.limit
    );

    const uiTracks = paginatedTracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artistName,
      album: track.albumName,
      artwork: track.coverImage,
      duration: Math.floor(track.duration / 1000),
      type: "song" as const,
      audioUrl: track.streamUrl,
    }));

    return uiTracks;
  });
