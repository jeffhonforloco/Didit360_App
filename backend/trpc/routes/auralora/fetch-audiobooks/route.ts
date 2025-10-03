import { publicProcedure } from "../../../create-context";
import { z } from "zod";

interface AuraloraAudiobook {
  id: string;
  title: string;
  author: string;
  narrator?: string;
  coverImage: string;
  duration: number;
  description: string;
  categories: string[];
  rating?: number;
  publishDate?: string;
  language?: string;
  audioUrl?: string;
}

async function fetchFromAuralora(): Promise<AuraloraAudiobook[]> {
  try {
    console.log('[Auralora] Fetching audiobooks from www.Auralora.com');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://www.auralora.com/api/audiobooks', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MusicApp/1.0',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Auralora] API returned status ${response.status}, using fallback data`);
      return getFallbackAudiobooks();
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.audiobooks)) {
      console.warn('[Auralora] Invalid response format, using fallback data');
      return getFallbackAudiobooks();
    }

    console.log(`[Auralora] Successfully fetched ${data.audiobooks.length} audiobooks`);
    return data.audiobooks;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.warn('[Auralora] Request timeout, using fallback data');
    } else {
      console.warn('[Auralora] Error fetching audiobooks, using fallback data:', error.message);
    }
    return getFallbackAudiobooks();
  }
}

function getFallbackAudiobooks(): AuraloraAudiobook[] {
  console.log('[Auralora] Using fallback audiobook data');
  
  return [
    {
      id: "aur1",
      title: "The Midnight Library",
      author: "Matt Haig",
      narrator: "Carey Mulligan",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      duration: 18000,
      description: "A novel about all the choices that go into a life well lived",
      categories: ["Fiction", "Fantasy", "Philosophy"],
      rating: 4.7,
      publishDate: "2020-08-13",
      language: "English",
    },
    {
      id: "aur2",
      title: "Atomic Habits",
      author: "James Clear",
      narrator: "James Clear",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      duration: 19800,
      description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
      categories: ["Self-Help", "Business", "Psychology"],
      rating: 4.8,
      publishDate: "2018-10-16",
      language: "English",
    },
    {
      id: "aur3",
      title: "Where the Crawdads Sing",
      author: "Delia Owens",
      narrator: "Cassandra Campbell",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      duration: 21600,
      description: "A coming-of-age mystery set in the marshlands of North Carolina",
      categories: ["Fiction", "Mystery", "Romance"],
      rating: 4.6,
      publishDate: "2018-08-14",
      language: "English",
    },
    {
      id: "aur4",
      title: "Educated",
      author: "Tara Westover",
      narrator: "Julia Whelan",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      duration: 22800,
      description: "A Memoir - A powerful story of education and transformation",
      categories: ["Biography", "Memoir", "Non-Fiction"],
      rating: 4.9,
      publishDate: "2018-02-20",
      language: "English",
    },
    {
      id: "aur5",
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      narrator: "Alma Cuervo, Julia Whelan",
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      duration: 20400,
      description: "A captivating novel about Hollywood's golden age",
      categories: ["Fiction", "Historical Fiction", "LGBTQ+"],
      rating: 4.8,
      publishDate: "2017-06-13",
      language: "English",
    },
    {
      id: "aur6",
      title: "Sapiens",
      author: "Yuval Noah Harari",
      narrator: "Derek Perkins",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      duration: 27000,
      description: "A Brief History of Humankind",
      categories: ["History", "Science", "Philosophy"],
      rating: 4.7,
      publishDate: "2015-02-10",
      language: "English",
    },
    {
      id: "aur7",
      title: "The Psychology of Money",
      author: "Morgan Housel",
      narrator: "Chris Hill",
      coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=600&fit=crop",
      duration: 16200,
      description: "Timeless lessons on wealth, greed, and happiness",
      categories: ["Business", "Finance", "Self-Help"],
      rating: 4.8,
      publishDate: "2020-09-08",
      language: "English",
    },
    {
      id: "aur8",
      title: "Becoming",
      author: "Michelle Obama",
      narrator: "Michelle Obama",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      duration: 25200,
      description: "An intimate, powerful, and inspiring memoir",
      categories: ["Biography", "Memoir", "Politics"],
      rating: 4.9,
      publishDate: "2018-11-13",
      language: "English",
    },
    {
      id: "aur9",
      title: "The Alchemist",
      author: "Paulo Coelho",
      narrator: "Jeremy Irons",
      coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      duration: 14400,
      description: "A magical story about following your dreams",
      categories: ["Fiction", "Philosophy", "Adventure"],
      rating: 4.6,
      publishDate: "1988-01-01",
      language: "English",
    },
    {
      id: "aur10",
      title: "The Power of Now",
      author: "Eckhart Tolle",
      narrator: "Eckhart Tolle",
      coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      duration: 16800,
      description: "A Guide to Spiritual Enlightenment",
      categories: ["Self-Help", "Spirituality", "Philosophy"],
      rating: 4.7,
      publishDate: "1997-01-01",
      language: "English",
    },
    {
      id: "aur11",
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      narrator: "Roger Wayne",
      coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
      duration: 18000,
      description: "A Counterintuitive Approach to Living a Good Life",
      categories: ["Self-Help", "Philosophy", "Psychology"],
      rating: 4.5,
      publishDate: "2016-09-13",
      language: "English",
    },
    {
      id: "aur12",
      title: "Harry Potter and the Sorcerer's Stone",
      author: "J.K. Rowling",
      narrator: "Jim Dale",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
      duration: 28620,
      description: "The first book in the beloved Harry Potter series",
      categories: ["Fantasy", "Young Adult", "Adventure"],
      rating: 4.9,
      publishDate: "1997-06-26",
      language: "English",
    },
  ];
}

export const fetchAudiobooksProcedure = publicProcedure
  .input(z.object({
    limit: z.number().optional().default(20),
    category: z.string().optional(),
  }).optional().default({ limit: 20 }))
  .query(async ({ input }) => {
    const limit = input?.limit ?? 20;
    const category = input?.category;

    const audiobooks = await fetchFromAuralora();
    
    let filteredAudiobooks = audiobooks;
    
    if (category) {
      filteredAudiobooks = audiobooks.filter(book => 
        book.categories.some(cat => 
          cat.toLowerCase().includes(category.toLowerCase())
        )
      );
    }
    
    const limitedAudiobooks = filteredAudiobooks.slice(0, limit);
    
    const tracks = limitedAudiobooks.map(book => ({
      id: book.id,
      title: book.title,
      artist: book.author,
      artwork: book.coverImage,
      duration: book.duration,
      type: 'audiobook' as const,
      description: book.description,
      narrator: book.narrator,
      categories: book.categories,
      rating: book.rating,
      publishDate: book.publishDate,
      language: book.language,
      audioUrl: book.audioUrl,
    }));

    return {
      audiobooks: tracks,
      total: filteredAudiobooks.length,
      source: 'Auralora',
      lastUpdated: new Date().toISOString(),
    };
  });

export const getAudiobookDetailsProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input }) => {
    const audiobooks = await fetchFromAuralora();
    const audiobook = audiobooks.find(book => book.id === input.id);
    
    if (!audiobook) {
      throw new Error(`Audiobook with id ${input.id} not found`);
    }

    return {
      ...audiobook,
      type: 'audiobook' as const,
    };
  });
