import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getArtistsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      genre: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[artists] Getting artists", input);

    const mockArtists = [
      {
        id: "artist-1",
        name: "Electronic Waves",
        bio: "Electronic music producer and DJ",
        genre: "Electronic",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        verified: true,
        followers: 125000,
        monthlyListeners: 450000,
        albumCount: 5,
        trackCount: 48,
        popularity: 88,
        socialLinks: {
          instagram: "https://instagram.com/electronicwaves",
          twitter: "https://twitter.com/electronicwaves",
          spotify: "https://open.spotify.com/artist/123",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-2",
        name: "Neon Lights",
        bio: "Synthwave artist from Los Angeles",
        genre: "Synthwave",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        verified: true,
        followers: 98000,
        monthlyListeners: 320000,
        albumCount: 3,
        trackCount: 32,
        popularity: 92,
        socialLinks: {
          instagram: "https://instagram.com/neonlights",
          twitter: "https://twitter.com/neonlights",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-3",
        name: "Ambient Collective",
        bio: "Creating peaceful soundscapes",
        genre: "Ambient",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        verified: false,
        followers: 45000,
        monthlyListeners: 180000,
        albumCount: 7,
        trackCount: 56,
        popularity: 75,
        socialLinks: {
          spotify: "https://open.spotify.com/artist/789",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-4",
        name: "Space Voyager",
        bio: "Cosmic electronic music explorer",
        genre: "Electronic",
        image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        verified: true,
        followers: 210000,
        monthlyListeners: 680000,
        albumCount: 8,
        trackCount: 72,
        popularity: 91,
        socialLinks: {
          instagram: "https://instagram.com/spacevoyager",
          spotify: "https://open.spotify.com/artist/456",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-5",
        name: "Urban Echo",
        bio: "City sounds and urban beats",
        genre: "Hip Hop",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
        verified: true,
        followers: 156000,
        monthlyListeners: 520000,
        albumCount: 4,
        trackCount: 38,
        popularity: 86,
        socialLinks: {
          instagram: "https://instagram.com/urbanecho",
          twitter: "https://twitter.com/urbanecho",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-6",
        name: "Sandstorm",
        bio: "Desert rock and alternative sounds",
        genre: "Rock",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
        verified: false,
        followers: 67000,
        monthlyListeners: 240000,
        albumCount: 6,
        trackCount: 54,
        popularity: 79,
        socialLinks: {
          spotify: "https://open.spotify.com/artist/789",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-7",
        name: "Alpine Sound",
        bio: "Mountain-inspired ambient music",
        genre: "Ambient",
        image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800",
        verified: false,
        followers: 52000,
        monthlyListeners: 195000,
        albumCount: 9,
        trackCount: 68,
        popularity: 73,
        socialLinks: {
          spotify: "https://open.spotify.com/artist/101",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-8",
        name: "Synthwave Collective",
        bio: "Retro-futuristic synthwave group",
        genre: "Synthwave",
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        verified: true,
        followers: 189000,
        monthlyListeners: 610000,
        albumCount: 5,
        trackCount: 45,
        popularity: 93,
        socialLinks: {
          instagram: "https://instagram.com/synthwavecollective",
          twitter: "https://twitter.com/synthwavecollective",
          spotify: "https://open.spotify.com/artist/202",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filteredArtists = mockArtists;

    if (input.genre) {
      filteredArtists = filteredArtists.filter((a) => a.genre === input.genre);
    }

    const paginatedArtists = filteredArtists.slice(
      input.offset,
      input.offset + input.limit
    );

    const uiArtists = paginatedArtists.map(artist => ({
      id: artist.id,
      name: artist.name,
      image: artist.image,
      followers: artist.followers.toLocaleString(),
      verified: artist.verified,
    }));

    return uiArtists;
  });
