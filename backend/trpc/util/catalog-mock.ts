import { allTracks } from "@/data/mockData";

export interface GetMockUpdateEventsInput {
  since: string;
  until: string;
  limit: number;
}

type EntityType =
  | "track"
  | "video"
  | "artist"
  | "release"
  | "podcast"
  | "episode"
  | "audiobook"
  | "book"
  | "image";

export interface UpdateEvent {
  op: "upsert" | "delete";
  entity: EntityType;
  id: string;
  version: number;
  updated_at: string;
}

function pickEntityTypeFromTrackType(t: string): EntityType {
  if (t === "video") return "video";
  if (t === "podcast") return "episode";
  if (t === "audiobook") return "audiobook";
  return "track";
}

function hashStringToInt(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getMockUpdateEvents({ since, until, limit }: GetMockUpdateEventsInput): UpdateEvent[] {
  const sinceTime = Date.parse(since);
  const untilTime = Date.parse(until);
  const windowMs = Math.max(1, untilTime - sinceTime);

  const items = allTracks.slice(0, Math.min(limit, allTracks.length));

  const events: UpdateEvent[] = items.map((t, idx) => {
    const entity = pickEntityTypeFromTrackType(t.type);
    const base = hashStringToInt(t.id + t.title);
    const version = (base % 5) + 1; // 1..5
    const updated_at = new Date(sinceTime + Math.floor((idx / items.length) * windowMs)).toISOString();
    const op: "upsert" | "delete" = idx % 17 === 0 ? "delete" : "upsert";
    return { op, entity, id: t.id, version, updated_at };
  });

  return events;
}
