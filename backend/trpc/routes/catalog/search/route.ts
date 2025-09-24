import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import {
  allTracks,
  searchArtists,
  searchAlbums,
  podcastShows,
  allPodcastEpisodes,
  videoTracks,
} from "@/data/mockData";

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
    const q = input.q.trim().toLowerCase();

    const tracks = allTracks
      .filter((t) =>
        [t.title, t.artist, t.album ?? ""].some((s) => (s ?? "").toLowerCase().includes(q))
      )
      .map((t) => ({
        id: t.id,
        type: t.type === "video" ? ("video" as const) : ("track" as const),
        title: t.title,
        subtitle: t.album ? `${t.artist} • ${t.album}` : t.artist,
        artwork: t.artwork,
      }));

    const artists = searchArtists
      .filter((a) => a.name.toLowerCase().includes(q))
      .map((a) => ({
        id: a.id,
        type: "artist" as const,
        title: a.name,
        subtitle: "Artist",
        artwork: a.image,
      }));

    const releases = searchAlbums
      .filter((al) =>
        [al.title, al.artist, al.year].some((s) => (s ?? "").toLowerCase().includes(q))
      )
      .map((al) => ({
        id: al.id,
        type: "release" as const,
        title: al.title,
        subtitle: `${al.artist} • Album • ${al.year}`,
        artwork: al.artwork,
      }));

    const podcasts = podcastShows
      .filter((p) => [p.title, p.host].some((s) => (s ?? "").toLowerCase().includes(q)))
      .map((p) => ({
        id: p.id,
        type: "podcast" as const,
        title: p.title,
        subtitle: `${p.host} • Podcast`,
        artwork: p.artwork,
      }));

    const episodes = allPodcastEpisodes
      .filter((e) => [e.title, e.artist].some((s) => (s ?? "").toLowerCase().includes(q)))
      .map((e) => ({
        id: e.id,
        type: "episode" as const,
        title: e.title,
        subtitle: `${e.artist} • Episode`,
        artwork: e.artwork,
      }));

    const videos = videoTracks
      .filter((v) => [v.title, v.artist, v.album ?? ""].some((s) => (s ?? "").toLowerCase().includes(q)))
      .map((v) => ({
        id: v.id,
        type: "video" as const,
        title: v.title,
        subtitle: v.album ? `${v.artist} • ${v.album}` : v.artist,
        artwork: v.artwork,
      }));

    let combined: Array<z.infer<typeof SearchItemSchema>> = [];

    const add = (arr: Array<z.infer<typeof SearchItemSchema>>) => {
      combined = combined.concat(arr);
    };

    const type = input.type;
    if (type === "all") {
      add(artists);
      add(releases);
      add(tracks);
      add(podcasts);
      add(episodes);
      add(videos);
    } else if (type === "artist") add(artists);
    else if (type === "release") add(releases);
    else if (type === "track") add(tracks.filter((t) => t.type === "track"));
    else if (type === "video") add(videos);
    else if (type === "podcast") add(podcasts);
    else if (type === "episode") add(episodes);

    const unique = new Map<string, z.infer<typeof SearchItemSchema>>();
    for (const item of combined) {
      const key = `${item.type}:${item.id}`;
      if (!unique.has(key)) unique.set(key, item);
    }

    const result = Array.from(unique.values()).slice(0, input.limit);
    return result;
  });
