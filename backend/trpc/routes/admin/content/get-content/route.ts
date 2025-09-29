import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const getContentInputSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['audio', 'video', 'podcast', 'audiobook']).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

const contentItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string().optional(),
  type: z.enum(['audio', 'video', 'podcast', 'audiobook']),
  duration: z.number().optional(),
  artwork: z.string().optional(),
  uploadDate: z.string(),
  status: z.enum(['active', 'pending', 'rejected', 'processing']),
  plays: z.number(),
  reports: z.number(),
});

const getContentOutputSchema = z.object({
  items: z.array(contentItemSchema),
  total: z.number(),
  hasMore: z.boolean(),
});

// Mock data - replace with actual database queries
const mockContent = [
  { id: '1', title: 'Midnight Dreams', artist: 'Luna Rodriguez', type: 'audio' as const, duration: 240, artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop', uploadDate: '2024-01-15', status: 'active' as const, plays: 24500, reports: 0 },
  { id: '2', title: 'Electric Nights', artist: 'Neon Pulse', type: 'audio' as const, duration: 195, artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=60&h=60&fit=crop', uploadDate: '2024-01-14', status: 'active' as const, plays: 18200, reports: 2 },
  { id: '3', title: 'Ocean Waves Documentary', artist: 'Nature Films', type: 'video' as const, duration: 3600, artwork: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=60&h=60&fit=crop', uploadDate: '2024-01-13', status: 'active' as const, plays: 15600, reports: 0 },
  { id: '4', title: 'Tech Talk Episode 42', artist: 'Tech Podcast Network', type: 'podcast' as const, duration: 2700, artwork: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=60&h=60&fit=crop', uploadDate: '2024-01-12', status: 'pending' as const, plays: 0, reports: 0 },
  { id: '5', title: 'The Great Gatsby', artist: 'F. Scott Fitzgerald', type: 'audiobook' as const, duration: 32400, artwork: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=60&h=60&fit=crop', uploadDate: '2024-01-11', status: 'active' as const, plays: 8900, reports: 1 },
];

export const getContentProcedure = publicProcedure
  .input(getContentInputSchema)
  .output(getContentOutputSchema)
  .query(async ({ input }) => {
    console.log('[Admin] Getting content with filters:', input);
    
    let filteredContent = mockContent;
    
    // Apply search filter
    if (input.search) {
      const searchLower = input.search.toLowerCase();
      filteredContent = filteredContent.filter(item => 
        item.title.toLowerCase().includes(searchLower) ||
        (item.artist && item.artist.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply type filter
    if (input.type) {
      filteredContent = filteredContent.filter(item => item.type === input.type);
    }
    
    const total = filteredContent.length;
    const paginatedContent = filteredContent.slice(input.offset, input.offset + input.limit);
    const hasMore = input.offset + input.limit < total;
    
    return {
      items: paginatedContent,
      total,
      hasMore,
    };
  });