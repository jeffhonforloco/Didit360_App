import { createTRPCRouter } from "./create-context";
import hiRoute, { hiQuery, hiMutation } from "./routes/example/hi/route";
import { getLibraryProcedure } from "./routes/library/get-library/route";
import { updateLibraryProcedure } from "./routes/library/update-library/route";

// Catalog
import { updatesProcedure } from "./routes/catalog/updates/route";
import { getTrackProcedure } from "./routes/catalog/get-track/route";
import { searchProcedure } from "./routes/catalog/search/route";
import { getVideoProcedure } from "./routes/catalog/get-video/route";
import { isStreamableProcedure } from "./routes/catalog/rights/is-streamable/route";
import { getFeaturedProcedure, trackStreamProcedure, getMetricsProcedure } from "./routes/catalog/featured/route";

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
import { getUsersProcedure } from "./routes/admin/users/get-users/route";
import { getAnalyticsProcedure } from "./routes/admin/analytics/get-analytics/route";
import { getDashboardStatsProcedure } from "./routes/admin/dashboard/get-stats/route";
import { getContentProcedure } from "./routes/admin/content/get-content/route";
import { getIngestJobsProcedure } from "./routes/admin/ingest/get-jobs/route";
import { getMixMindSessionsProcedure } from "./routes/admin/mixmind/get-sessions/route";
import { getMixMindConfigProcedure, updateMixMindConfigProcedure } from "./routes/admin/mixmind/get-config/route";

// Enrichment
import { 
  extractAudioFeaturesProcedure, 
  generateEmbeddingProcedure, 
  findSimilarProcedure 
} from "./routes/enrichment/audio-features/route";

// DJ Instinct Live
import { liveStartProcedure } from "./routes/dj-instinct/live/start/route";
import { liveParamsProcedure } from "./routes/dj-instinct/live/params/route";
import { livePairingStartProcedure } from "./routes/dj-instinct/live/pair/start/route";
import { liveSafetyProcedure } from "./routes/dj-instinct/live/safety/route";
import { liveEmergencyFadeProcedure } from "./routes/dj-instinct/live/emergency/fade/route";

// SEO
import { detectBotProcedure } from "./routes/seo/detect-bot/route";
import { generateMetaProcedure } from "./routes/seo/generate-meta/route";

// Genres
import { getGenresProcedure } from "./routes/genres/get-genres/route";
import { submitGenreProcedure } from "./routes/genres/submit-genre/route";
import { approveGenreProcedure } from "./routes/genres/approve-genre/route";
import { updateGenreProcedure } from "./routes/genres/update-genre/route";
import { getPendingGenresProcedure } from "./routes/genres/get-pending-genres/route";

// AI
import { transcribeProcedure } from "./routes/ai/transcribe/route";
import { recommendationsProcedure } from "./routes/ai/recommendations/route";
import { generatePlaylistProcedure } from "./routes/ai/generate-playlist/route";
import { smartRecommendationsProcedure } from "./routes/ai/smart-recommendations/route";
import { moodDetectionProcedure } from "./routes/ai/mood-detection/route";
import { lyricsAnalysisProcedure, generateLyricsProcedure } from "./routes/ai/lyrics-analysis/route";
import { voiceCommandProcedure, conversationProcedure } from "./routes/ai/voice-assistant/route";
import { contextualDiscoveryProcedure } from "./routes/ai/contextual-discovery/route";
import { collaborativeFilteringProcedure, findSimilarUsersProcedure } from "./routes/ai/collaborative-filtering/route";
import { optimizeSetlistProcedure, analyzeSetProcedure } from "./routes/ai/setlist-optimizer/route";
import { generateTrackEmbeddingProcedure, findSimilarTracksProcedure, semanticSearchProcedure } from "./routes/ai/similarity-search/route";

// News
import { fetchNewsProcedure } from "./routes/news/fetch-news/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute, // mutation (backward compatibility)
    hiQuery: hiQuery, // query version
    hiMutation: hiMutation, // explicit mutation
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
    getFeatured: getFeaturedProcedure,
    trackStream: trackStreamProcedure,
    getMetrics: getMetricsProcedure,
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
  enrichment: createTRPCRouter({
    extractAudioFeatures: extractAudioFeaturesProcedure,
    generateEmbedding: generateEmbeddingProcedure,
    findSimilar: findSimilarProcedure,
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
    users: createTRPCRouter({
      getUsers: getUsersProcedure,
    }),
    analytics: createTRPCRouter({
      getAnalytics: getAnalyticsProcedure,
    }),
    dashboard: createTRPCRouter({
      getStats: getDashboardStatsProcedure,
    }),
    content: createTRPCRouter({
      getContent: getContentProcedure,
    }),
    ingest: createTRPCRouter({
      getJobs: getIngestJobsProcedure,
    }),
    mixmind: createTRPCRouter({
      getSessions: getMixMindSessionsProcedure,
      getConfig: getMixMindConfigProcedure,
      updateConfig: updateMixMindConfigProcedure,
    }),
  }),
  djInstinct: createTRPCRouter({
    live: createTRPCRouter({
      start: liveStartProcedure,
      params: liveParamsProcedure,
      pair: createTRPCRouter({
        start: livePairingStartProcedure,
      }),
      safety: liveSafetyProcedure,
      emergency: createTRPCRouter({
        fade: liveEmergencyFadeProcedure,
      }),
    }),
  }),
  seo: createTRPCRouter({
    detectBot: detectBotProcedure,
    generateMeta: generateMetaProcedure,
  }),
  genres: createTRPCRouter({
    getGenres: getGenresProcedure,
    submitGenre: submitGenreProcedure,
    approveGenre: approveGenreProcedure,
    updateGenre: updateGenreProcedure,
    getPendingGenres: getPendingGenresProcedure,
  }),
  ai: createTRPCRouter({
    transcribe: transcribeProcedure,
    recommendations: recommendationsProcedure,
    generatePlaylist: generatePlaylistProcedure,
    smartRecommendations: smartRecommendationsProcedure,
    moodDetection: moodDetectionProcedure,
    lyricsAnalysis: lyricsAnalysisProcedure,
    generateLyrics: generateLyricsProcedure,
    voiceCommand: voiceCommandProcedure,
    conversation: conversationProcedure,
    contextualDiscovery: contextualDiscoveryProcedure,
    collaborativeFiltering: collaborativeFilteringProcedure,
    findSimilarUsers: findSimilarUsersProcedure,
    optimizeSetlist: optimizeSetlistProcedure,
    analyzeSet: analyzeSetProcedure,
    generateTrackEmbedding: generateTrackEmbeddingProcedure,
    findSimilarTracks: findSimilarTracksProcedure,
    semanticSearch: semanticSearchProcedure,
  }),
  news: createTRPCRouter({
    fetchNews: fetchNewsProcedure,
  }),
});

export type AppRouter = typeof appRouter;