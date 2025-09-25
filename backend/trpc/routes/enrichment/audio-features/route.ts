import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { enrichmentService } from "@/backend/services/enrichment";

export const extractAudioFeaturesProcedure = publicProcedure
  .input(
    z.object({
      entityType: z.string(),
      entityId: z.number(),
      audioUri: z.string().url(),
    })
  )
  .output(
    z.object({
      jobId: z.string(),
      features: z.object({
        tempo: z.number().optional(),
        key: z.string().optional(),
        mode: z.string().optional(),
        energy: z.number().optional(),
        danceability: z.number().optional(),
        valence: z.number().optional(),
        loudness: z.number().optional(),
        speechiness: z.number().optional(),
        instrumentalness: z.number().optional(),
        acousticness: z.number().optional(),
        liveness: z.number().optional(),
        time_signature: z.number().optional(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[enrichment] Extracting audio features for ${input.entityType}:${input.entityId}`);
    
    const job = await enrichmentService.createEnrichmentJob(
      input.entityType,
      input.entityId,
      'audio_features',
      { audio_uri: input.audioUri }
    );
    
    // Process immediately for demo
    await enrichmentService.processEnrichmentJob(job.id);
    
    const features = await enrichmentService.extractAudioFeatures(
      input.entityType,
      input.entityId,
      input.audioUri
    );
    
    return {
      jobId: job.id,
      features: {
        tempo: features.tempo,
        key: features.key,
        mode: features.mode,
        energy: features.energy,
        danceability: features.danceability,
        valence: features.valence,
        loudness: features.loudness,
        speechiness: features.speechiness,
        instrumentalness: features.instrumentalness,
        acousticness: features.acousticness,
        liveness: features.liveness,
        time_signature: features.time_signature,
      },
    };
  });

export const generateEmbeddingProcedure = publicProcedure
  .input(
    z.object({
      entityType: z.string(),
      entityId: z.number(),
      content: z.string(),
      embeddingType: z.string().default('content'),
    })
  )
  .output(
    z.object({
      jobId: z.string(),
      embedding: z.object({
        vector: z.array(z.number()),
        dimensions: z.number(),
        model_version: z.string(),
      }),
    })
  )
  .mutation(async ({ input }) => {
    console.log(`[enrichment] Generating embedding for ${input.entityType}:${input.entityId}`);
    
    const job = await enrichmentService.createEnrichmentJob(
      input.entityType,
      input.entityId,
      'embeddings',
      { 
        content: input.content,
        embedding_type: input.embeddingType,
      }
    );
    
    // Process immediately for demo
    await enrichmentService.processEnrichmentJob(job.id);
    
    const embedding = await enrichmentService.generateEmbedding(
      input.entityType,
      input.entityId,
      input.content,
      input.embeddingType
    );
    
    return {
      jobId: job.id,
      embedding: {
        vector: embedding.vector,
        dimensions: embedding.dimensions,
        model_version: embedding.model_version,
      },
    };
  });

export const findSimilarProcedure = publicProcedure
  .input(
    z.object({
      trackId: z.number(),
      limit: z.number().min(1).max(50).default(10),
    })
  )
  .output(
    z.object({
      similar_tracks: z.array(
        z.object({
          track_id: z.number(),
          similarity_score: z.number(),
          similarity_type: z.enum(['audio', 'metadata', 'collaborative', 'hybrid']),
        })
      ),
      clusters: z.array(
        z.object({
          cluster_id: z.string(),
          center_distance: z.number(),
          cluster_size: z.number(),
        })
      ),
    })
  )
  .query(async ({ input }) => {
    console.log(`[enrichment] Finding similar tracks for ${input.trackId}`);
    
    const analysis = await enrichmentService.findSimilarTracks(input.trackId, input.limit);
    
    return analysis;
  });