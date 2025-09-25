import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { getLibraryProcedure } from "./routes/library/get-library/route";
import { updateLibraryProcedure } from "./routes/library/update-library/route";

// Catalog
import { updatesProcedure } from "./routes/catalog/updates/route";
import { getTrackProcedure } from "./routes/catalog/get-track/route";
import { searchProcedure } from "./routes/catalog/search/route";
import { getVideoProcedure } from "./routes/catalog/get-video/route";
import { isStreamableProcedure } from "./routes/catalog/rights/is-streamable/route";

// Ingest
import { ingestJsonProcedure } from "./routes/ingest/json/route";
import { ingestRssProcedure } from "./routes/ingest/rss/route";
import { ingestJobProcedure, getIngestJobProcedure } from "./routes/ingest/job/route";

// MixMind
import { mixmindCreateSessionProcedure } from "./routes/mixmind/sessions/create/route";
import { mixmindGetSessionProcedure } from "./routes/mixmind/sessions/get/route";
import { mixmindNextProcedure } from "./routes/mixmind/sessions/next/route";

// Admin
import { getDDLProcedure } from "./routes/admin/db/ddl/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  library: createTRPCRouter({
    get: getLibraryProcedure,
    update: updateLibraryProcedure,
  }),
  catalog: createTRPCRouter({
    updates: updatesProcedure,
    getTrack: getTrackProcedure,
    getVideo: getVideoProcedure,
    search: searchProcedure,
    rights: createTRPCRouter({
      isStreamable: isStreamableProcedure,
    }),
  }),
  ingest: createTRPCRouter({
    json: ingestJsonProcedure,
    rss: ingestRssProcedure,
    createJob: ingestJobProcedure,
    getJob: getIngestJobProcedure,
  }),
  mixmind: createTRPCRouter({
    createSession: mixmindCreateSessionProcedure,
    getSession: mixmindGetSessionProcedure,
    next: mixmindNextProcedure,
  }),
  admin: createTRPCRouter({
    db: createTRPCRouter({
      ddl: getDDLProcedure,
    }),
  }),
});

export type AppRouter = typeof appRouter;