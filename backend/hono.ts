import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
  })
);

// Utilities
function stableStringify(o: unknown): string {
  const seen = new WeakSet();
  const stringify = (obj: any): string => {
    if (obj === null || typeof obj !== "object") return JSON.stringify(obj);
    if (seen.has(obj)) return '"[Circular]"';
    seen.add(obj);
    if (Array.isArray(obj)) return `[${obj.map((v) => stringify(v)).join(",")}]`;
    const keys = Object.keys(obj).sort();
    return `{${keys.map((k) => `${JSON.stringify(k)}:${stringify(obj[k])}`).join(",")}}`;
  };
  return stringify(o);
}

function weakEtagFrom(obj: unknown): string {
  const base = stableStringify(obj);
  let hash = 0;
  for (let i = 0; i < base.length; i++) {
    hash = (hash * 31 + base.charCodeAt(i)) >>> 0;
  }
  return `W/"${hash.toString(16)}-${base.length}"`;
}

function notModified(c: any) {
  return c.body(null, 304);
}

// Simple health check endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});

// --- REST scaffolding per v1 contract ---

// Updates feed
app.get("/v1/updates", (c) => {
  const since = c.req.query("since") ?? new Date(Date.now() - 3600_000).toISOString();
  const until = c.req.query("until") ?? new Date().toISOString();
  const limit = Math.min(Number(c.req.query("limit") ?? 500), 500);

  let events: Array<{
    op: "upsert" | "delete";
    entity: "track" | "video" | "artist" | "release" | "podcast" | "episode" | "book" | "audiobook" | "image";
    id: string;
    version: number;
    updated_at: string;
  }> = [];

  try {
    // Dynamically import to avoid circular deps in some runtimes
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getMockUpdateEvents } = require("./trpc/util/catalog-mock");
    events = getMockUpdateEvents({ since, until, limit });
  } catch (e) {
    console.warn("/v1/updates mock generation failed", e);
  }

  const body = { since, until, events, next_since: until };
  const etag = weakEtagFrom(body);
  const inm = c.req.header("if-none-match");
  if (inm && inm === etag) return notModified(c);
  return c.json(body, 200, { ETag: etag });
});

// Entity helper
function entityResponse(c: any, id: string, entity: string) {
  const now = new Date().toISOString();
  const data = { id, title: `${entity} ${id}`, artwork: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800" };
  const payload = { id, version: 1, etag: undefined as string | undefined, updated_at: now, data };
  const etag = weakEtagFrom(payload);
  payload.etag = etag;
  const inm = c.req.header("if-none-match");
  if (inm && inm === etag) return notModified(c);
  return c.json(payload, 200, { ETag: etag });
}

app.get("/v1/tracks/:id", (c) => entityResponse(c, c.req.param("id"), "track"));
app.get("/v1/videos/:id", (c) => entityResponse(c, c.req.param("id"), "video"));
app.get("/v1/podcasts/:id", (c) => entityResponse(c, c.req.param("id"), "podcast"));
app.get("/v1/episodes/:id", (c) => entityResponse(c, c.req.param("id"), "episode"));
app.get("/v1/audiobooks/:id", (c) => entityResponse(c, c.req.param("id"), "audiobook"));
app.get("/v1/books/:id", (c) => entityResponse(c, c.req.param("id"), "book"));
app.get("/v1/images/:id", (c) => entityResponse(c, c.req.param("id"), "image"));

// Search proxy scaffold
app.get("/v1/search", (c) => {
  const q = c.req.query("q") ?? "";
  const type = (c.req.query("type") ?? "all") as string;
  const page = Number(c.req.query("page") ?? 1);
  const size = Math.min(Number(c.req.query("size") ?? 20), 50);
  const results: Array<{ id: string; type: string; title: string; subtitle?: string; artwork?: string; version: number }> = q
    ? [
        { id: "sample-1", type: type === "all" ? "track" : type, title: `Result for "${q}"`, artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800", version: 1 },
      ]
    : [];
  const payload = { q, type, page, size, results };
  const etag = weakEtagFrom(payload);
  const inm = c.req.header("if-none-match");
  if (inm && inm === etag) return notModified(c);
  return c.json(payload, 200, { ETag: etag });
});

// Rights gate
app.get("/v1/rights/streamable", (c) => {
  const entityType = (c.req.query("entity_type") ?? "track").toString();
  const id = (c.req.query("id") ?? "").toString();
  const country = (c.req.query("country") ?? "US").toString().toUpperCase();
  const explicitOk = (c.req.query("explicit_ok") ?? "true").toString() !== "false";

  const reasons: string[] = [];
  if (!explicitOk && (entityType === "track" || entityType === "episode")) reasons.push("explicit_not_allowed");
  if (country === "KP") reasons.push("country_blocked");

  const payload = { allowed: reasons.length === 0, reason: reasons[0] } as { allowed: boolean; reason?: string };
  return c.json(payload);
});

export default app;