import { Hono } from "hono";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { appRouter } from "./trpc/app-router";
import { createContext } from "./trpc/create-context";
import type { LivePromptConfig, LiveParams, SafetyUpdate, LiveStartResponse, PairingResponse, Health, TrackLite } from "@/types/live";

// app will be mounted at /api
const app = new Hono();

// Enable CORS for all routes
app.use("*", cors());

// ---- Lightweight observability: request logging + metrics + correlation ----
const metrics = {
  startedAt: Date.now(),
  requestsTotal: 0,
  requestsByPath: new Map<string, { count: number; errors: number; totalMs: number }>(),
  recentErrors: [] as Array<{ id: string; path: string; method: string; status?: number; msg: string; at: number }>,
  recentEvents: [] as Array<{ level: string; message: string; at: number; ctx?: Record<string, unknown> }>,
};

function getOrInitPath(path: string) {
  if (!metrics.requestsByPath.has(path)) metrics.requestsByPath.set(path, { count: 0, errors: 0, totalMs: 0 });
  return metrics.requestsByPath.get(path)!;
}

app.use("*", async (c, next) => {
  const start = Date.now();
  const existingId = c.req.header("x-request-id");
  const reqId = existingId ?? (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`);
  const path = c.req.path;
  const method = c.req.method;
  c.res.headers.set("x-request-id", reqId);
  metrics.requestsTotal += 1;
  const pathMetrics = getOrInitPath(path);
  pathMetrics.count += 1;
  try {
    await next();
    const dur = Date.now() - start;
    pathMetrics.totalMs += dur;
    console.log(`[api] ${method} ${path} ${c.res.status} ${dur}ms id=${reqId}`);
  } catch (err: any) {
    const dur = Date.now() - start;
    pathMetrics.errors += 1;
    const msg = err?.message ?? String(err);
    metrics.recentErrors.unshift({ id: reqId, path, method, status: 500, msg, at: Date.now() });
    metrics.recentErrors = metrics.recentErrors.slice(0, 50);
    console.error(`[api] ${method} ${path} 500 ${dur}ms id=${reqId} error=${msg}`);
    throw err;
  }
});

// Mount tRPC router at /trpc
app.use(
  "/trpc/*",
  trpcServer({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext,
    onError: ({ error, path, type, ctx }) => {
      console.error(`[tRPC] Error in ${type} procedure ${path}:`, error);
      console.error(`[tRPC] Context:`, ctx);
    },
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

// Metrics endpoint (Prometheus text format)
app.get("/metrics", (c) => {
  const uptimeSeconds = Math.floor((Date.now() - metrics.startedAt) / 1000);
  let body = "# HELP api_requests_total Total API requests\n# TYPE api_requests_total counter\n";
  body += `api_requests_total ${metrics.requestsTotal}\n`;
  body += "# HELP api_request_path_count Requests per path\n# TYPE api_request_path_count counter\n";
  for (const [path, m] of metrics.requestsByPath.entries()) {
    body += `api_request_path_count{path="${path}"} ${m.count}\n`;
  }
  body += "# HELP api_request_path_errors Errors per path\n# TYPE api_request_path_errors counter\n";
  for (const [path, m] of metrics.requestsByPath.entries()) {
    body += `api_request_path_errors{path="${path}"} ${m.errors}\n`;
  }
  body += "# HELP api_request_path_duration_ms_total Total duration per path in ms\n# TYPE api_request_path_duration_ms_total counter\n";
  for (const [path, m] of metrics.requestsByPath.entries()) {
    body += `api_request_path_duration_ms_total{path="${path}"} ${m.totalMs}\n`;
  }
  body += "# HELP api_uptime_seconds Uptime in seconds\n# TYPE api_uptime_seconds gauge\n";
  body += `api_uptime_seconds ${uptimeSeconds}\n`;
  return c.body(body, 200, { "content-type": "text/plain; charset=utf-8" });
});

// Observability events intake
app.post("/v1/obs/events", async (c) => {
  try {
    const payload = await c.req.json<{ level?: string; message?: string; context?: Record<string, unknown> }>();
    const level = (payload.level ?? "info").toLowerCase();
    const message = payload.message ?? "";
    const ctx = payload.context ?? {};
    metrics.recentEvents.unshift({ level, message, at: Date.now(), ctx });
    metrics.recentEvents = metrics.recentEvents.slice(0, 200);
    console.log(`[obs] ${level}: ${message}`);
    return c.json({ ok: true });
  } catch (e: any) {
    return c.json({ ok: false, error: e?.message ?? String(e) }, 400);
  }
});

// Recent errors/events for quick diagnostics
app.get("/v1/obs/recent", (c) => {
  return c.json({
    errors: metrics.recentErrors,
    events: metrics.recentEvents,
  });
});

// --- Live DJ In-memory session store ---

type CastStatus = 'idle' | 'pairing' | 'casting';
interface LiveSessionState {
  sessionId: string;
  userId: string;
  startedAt: string;
  castStatus: CastStatus;
  params: Required<Required<Pick<LiveParams, 'energy' | 'transitionStyle'>>>;
  prompt: LivePromptConfig;
  safe: Required<Required<Pick<SafetyUpdate, 'doNotPlay' | 'explicitFilter' | 'safeMode'>>>;
  nowPlaying?: TrackLite;
  nextUp: TrackLite[];
}

const liveSessions = new Map<string, LiveSessionState>();

function getUserIdFrom(c: any): string {
  const hdr = c.req.header('x-user-id');
  return hdr && hdr.trim().length > 0 ? hdr : 'anon';
}

function ensureSessionFor(userId: string, cfg?: LivePromptConfig): LiveSessionState {
  const existing = liveSessions.get(userId);
  if (existing) return existing;
  const sessionId = `live_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const startedAt = new Date().toISOString();
  const prompt: LivePromptConfig = cfg ?? { vibe: '', genres: [], durationMinutes: 120 };
  const state: LiveSessionState = {
    sessionId,
    userId,
    startedAt,
    castStatus: 'idle',
    params: { energy: 65, transitionStyle: 'fade' },
    prompt,
    safe: { doNotPlay: [], explicitFilter: 'moderate', safeMode: true },
    nowPlaying: undefined,
    nextUp: [],
  };
  liveSessions.set(userId, state);
  return state;
}

function toStartResponse(s: LiveSessionState): LiveStartResponse {
  return {
    sessionId: s.sessionId,
    startedAt: s.startedAt,
    castStatus: s.castStatus,
    nowPlaying: s.nowPlaying,
    nextUp: s.nextUp,
  };
}

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

// DJ Instinct Live REST per OpenAPI under /dj-instinct
// POST /live/start
app.post("/dj-instinct/live/start", async (c) => {
  try {
    const userId = getUserIdFrom(c);
    const body = (await c.req.json()) as LivePromptConfig;
    if (!body || typeof body.vibe !== 'string' || !Array.isArray(body.genres) || typeof body.durationMinutes !== 'number') {
      return c.json({ error: 'Invalid prompt' }, 400);
    }
    const s = ensureSessionFor(userId, body);
    s.prompt = { ...s.prompt, ...body };
    s.startedAt = new Date().toISOString();
    s.castStatus = 'casting';
    const artwork = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800";
    s.nowPlaying = {
      id: `trk_${Date.now()}`,
      title: "Live Intro",
      artist: "DJ Instinct",
      bpm: 124,
      key: "Am",
      durationSec: 212,
      artwork,
    };
    s.nextUp = [1, 2, 3, 4].map((i) => ({
      id: `trk_${Date.now()}_${i}`,
      title: i % 2 ? "Sunset Groove" : "Amapiano Rush",
      artist: i % 2 ? "AI Selector" : "Instinct Engine",
      bpm: 118 + i,
      key: ["Am", "Cm", "Em", "Gm"][i % 4],
      durationSec: 180 + i * 12,
      artwork,
    }));
    const res = toStartResponse(s);
    return c.json(res, 200);
  } catch (e: any) {
    return c.json({ error: e?.message ?? 'Bad Request' }, 400);
  }
});

// POST /live/params
app.post("/dj-instinct/live/params", async (c) => {
  try {
    const userId = getUserIdFrom(c);
    const s = ensureSessionFor(userId);
    const body = (await c.req.json()) as LiveParams;
    if (typeof body.energy === 'number') s.params.energy = Math.max(0, Math.min(100, body.energy));
    if (body.transitionStyle) s.params.transitionStyle = body.transitionStyle;
    return c.json({ ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e?.message ?? 'Bad Request' }, 400);
  }
});

// POST /live/pair/start
app.post("/dj-instinct/live/pair/start", async (c) => {
  try {
    const userId = getUserIdFrom(c);
    const s = ensureSessionFor(userId);
    s.castStatus = 'pairing';
    const sessionId = s.sessionId;
    const base = (process.env.EXPO_PUBLIC_BASE_URL || (typeof location !== 'undefined' ? (location.origin as string) : 'https://didit360.com')) as string;
    const pairingUrl = `${base}/pair?session=${encodeURIComponent(sessionId)}`;
    const resp: PairingResponse = {
      sessionId,
      pairingUrl,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    };
    return c.json(resp, 200);
  } catch (e: any) {
    return c.json({ error: e?.message ?? 'Bad Request' }, 400);
  }
});

// POST /live/safety
app.post("/dj-instinct/live/safety", async (c) => {
  try {
    const userId = getUserIdFrom(c);
    const s = ensureSessionFor(userId);
    const body = (await c.req.json()) as SafetyUpdate;
    s.safe = {
      doNotPlay: body.doNotPlay ?? s.safe.doNotPlay,
      explicitFilter: body.explicitFilter ?? s.safe.explicitFilter,
      safeMode: body.safeMode ?? s.safe.safeMode,
    };
    return c.json({ ok: true }, 200);
  } catch (e: any) {
    return c.json({ error: e?.message ?? 'Bad Request' }, 400);
  }
});

// POST /live/emergency/fade
app.post("/dj-instinct/live/emergency/fade", async (c) => {
  try {
    const userId = getUserIdFrom(c);
    ensureSessionFor(userId);
    await new Promise((r) => setTimeout(r, 200));
    return c.json({ ok: true, at: new Date().toISOString() }, 200);
  } catch (e: any) {
    return c.json({ error: e?.message ?? 'Bad Request' }, 400);
  }
});

// GET /live/health
app.get("/dj-instinct/live/health", (c) => {
  const health: Health = {
    latencyMs: 42 + Math.round(Math.random() * 10),
    bufferMs: 180 + Math.round(Math.random() * 40),
    droppedPkts: Math.round(Math.random() * 2),
    network: (['good', 'fair', 'poor'] as const)[Math.min(2, Math.floor(Math.random() * 3))],
  };
  return c.json(health, 200);
});

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
