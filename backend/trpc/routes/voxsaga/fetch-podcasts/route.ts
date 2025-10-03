import { publicProcedure } from "../../../create-context";
import { z } from "zod";

interface VoxSagaPodcast {
  id: string;
  title: string;
  host: string;
  coverImage: string;
  duration: number;
  description: string;
  categories: string[];
  rating?: number;
  publishDate?: string;
  language?: string;
  audioUrl?: string;
  episodeNumber?: number;
  seasonNumber?: number;
}

async function fetchFromVoxSaga(): Promise<VoxSagaPodcast[]> {
  try {
    console.log('[VoxSaga] Fetching podcasts from www.Voxsaga.com');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.voxsaga.com/api/podcasts', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MusicApp/1.0',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[VoxSaga] API returned status ${response.status}, using fallback data`);
      return getFallbackPodcasts();
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.podcasts)) {
      console.warn('[VoxSaga] Invalid response format, using fallback data');
      return getFallbackPodcasts();
    }

    console.log(`[VoxSaga] Successfully fetched ${data.podcasts.length} podcasts`);
    return data.podcasts;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('[VoxSaga] Request timeout, using fallback data');
    } else {
      console.warn('[VoxSaga] Error fetching podcasts, using fallback data:', error.message);
    }
    return getFallbackPodcasts();
  }
}

function getFallbackPodcasts(): VoxSagaPodcast[] {
  console.log('[VoxSaga] Using fallback podcast data');
  
  return [
    {
      id: "vox1",
      title: "The Daily Tech Brief",
      host: "Sarah Johnson",
      coverImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop",
      duration: 1800,
      description: "Your daily dose of technology news and insights",
      categories: ["Technology", "News", "Business"],
      rating: 4.7,
      publishDate: "2024-01-15",
      language: "English",
      episodeNumber: 245,
      seasonNumber: 3,
    },
    {
      id: "vox2",
      title: "Mindful Mornings",
      host: "Dr. Emma Chen",
      coverImage: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=400&fit=crop",
      duration: 2400,
      description: "Start your day with meditation and mindfulness practices",
      categories: ["Health", "Wellness", "Meditation"],
      rating: 4.9,
      publishDate: "2024-01-14",
      language: "English",
      episodeNumber: 180,
      seasonNumber: 2,
    },
    {
      id: "vox3",
      title: "True Crime Chronicles",
      host: "Michael Roberts",
      coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=400&fit=crop",
      duration: 3600,
      description: "Deep dives into the most fascinating true crime cases",
      categories: ["True Crime", "Mystery", "Documentary"],
      rating: 4.8,
      publishDate: "2024-01-13",
      language: "English",
      episodeNumber: 156,
      seasonNumber: 4,
    },
    {
      id: "vox4",
      title: "The Entrepreneur's Journey",
      host: "Alex Martinez",
      coverImage: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop",
      duration: 2700,
      description: "Inspiring stories from successful entrepreneurs",
      categories: ["Business", "Entrepreneurship", "Motivation"],
      rating: 4.6,
      publishDate: "2024-01-12",
      language: "English",
      episodeNumber: 98,
      seasonNumber: 2,
    },
    {
      id: "vox5",
      title: "Science Simplified",
      host: "Dr. Lisa Wang",
      coverImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=400&fit=crop",
      duration: 2100,
      description: "Making complex science accessible to everyone",
      categories: ["Science", "Education", "Technology"],
      rating: 4.8,
      publishDate: "2024-01-11",
      language: "English",
      episodeNumber: 134,
      seasonNumber: 3,
    },
    {
      id: "vox6",
      title: "The History Hour",
      host: "Professor James Wilson",
      coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&h=400&fit=crop",
      duration: 3000,
      description: "Exploring fascinating moments from history",
      categories: ["History", "Education", "Documentary"],
      rating: 4.7,
      publishDate: "2024-01-10",
      language: "English",
      episodeNumber: 210,
      seasonNumber: 5,
    },
    {
      id: "vox7",
      title: "Comedy Central Podcast",
      host: "Dave Thompson",
      coverImage: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=400&h=400&fit=crop",
      duration: 2400,
      description: "Laugh out loud with the best comedians",
      categories: ["Comedy", "Entertainment", "Interviews"],
      rating: 4.5,
      publishDate: "2024-01-09",
      language: "English",
      episodeNumber: 167,
      seasonNumber: 3,
    },
    {
      id: "vox8",
      title: "Sports Talk Live",
      host: "Marcus Brown",
      coverImage: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=400&fit=crop",
      duration: 3300,
      description: "In-depth analysis of the latest sports news",
      categories: ["Sports", "News", "Analysis"],
      rating: 4.6,
      publishDate: "2024-01-08",
      language: "English",
      episodeNumber: 289,
      seasonNumber: 6,
    },
    {
      id: "vox9",
      title: "The Book Club",
      host: "Rachel Green",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
      duration: 2700,
      description: "Discussing the best books with authors and readers",
      categories: ["Literature", "Books", "Culture"],
      rating: 4.8,
      publishDate: "2024-01-07",
      language: "English",
      episodeNumber: 145,
      seasonNumber: 4,
    },
    {
      id: "vox10",
      title: "Cooking with Passion",
      host: "Chef Maria Rodriguez",
      coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&h=400&fit=crop",
      duration: 1800,
      description: "Delicious recipes and cooking tips from a master chef",
      categories: ["Food", "Cooking", "Lifestyle"],
      rating: 4.7,
      publishDate: "2024-01-06",
      language: "English",
      episodeNumber: 112,
      seasonNumber: 2,
    },
    {
      id: "vox11",
      title: "The Investment Show",
      host: "Robert Taylor",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=400&fit=crop",
      duration: 2400,
      description: "Smart investing strategies for everyone",
      categories: ["Finance", "Investment", "Business"],
      rating: 4.6,
      publishDate: "2024-01-05",
      language: "English",
      episodeNumber: 178,
      seasonNumber: 4,
    },
    {
      id: "vox12",
      title: "Travel Tales",
      host: "Sophie Anderson",
      coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop",
      duration: 2700,
      description: "Adventures and stories from around the world",
      categories: ["Travel", "Culture", "Adventure"],
      rating: 4.8,
      publishDate: "2024-01-04",
      language: "English",
      episodeNumber: 203,
      seasonNumber: 5,
    },
  ];
}

export const fetchPodcastsProcedure = publicProcedure
  .input(z.object({
    limit: z.number().optional().default(20),
    category: z.string().optional(),
  }).optional().default({ limit: 20 }))
  .query(async ({ input }) => {
    const limit = input?.limit ?? 20;
    const category = input?.category;

    const podcasts = await fetchFromVoxSaga();
    
    let filteredPodcasts = podcasts;
    
    if (category) {
      filteredPodcasts = podcasts.filter(podcast => 
        podcast.categories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
    }
    
    const limitedPodcasts = filteredPodcasts.slice(0, limit);
    
    const tracks = limitedPodcasts.map(podcast => ({
      id: podcast.id,
      title: podcast.title,
      artist: podcast.host,
      artwork: podcast.coverImage,
      duration: podcast.duration,
      type: 'podcast' as const,
      description: podcast.description,
      categories: podcast.categories,
      rating: podcast.rating,
      publishDate: podcast.publishDate,
      language: podcast.language,
      audioUrl: podcast.audioUrl,
      episodeNumber: podcast.episodeNumber,
      seasonNumber: podcast.seasonNumber,
    }));

    return {
      podcasts: tracks,
      total: filteredPodcasts.length,
      source: 'VoxSaga',
      lastUpdated: new Date().toISOString(),
    };
  });

export const getPodcastDetailsProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input }) => {
    const podcasts = await fetchFromVoxSaga();
    const podcast = podcasts.find(p => p.id === input.id);
    
    if (!podcast) {
      throw new Error(`Podcast with id ${input.id} not found`);
    }

    return {
      ...podcast,
      type: 'podcast' as const,
    };
  });
