import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { generateMetaTags, generateStructuredData, type SEOConfig } from '@/lib/seo';

export const generateMetaProcedure = publicProcedure
  .input(z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()).optional(),
    image: z.string().optional(),
    url: z.string().optional(),
    type: z.enum(['website', 'music.song', 'music.album', 'music.playlist', 'profile', 'article']).optional(),
    author: z.string().optional(),
    publishedTime: z.string().optional(),
    modifiedTime: z.string().optional(),
    section: z.string().optional(),
    tags: z.array(z.string()).optional(),
    audio: z.string().optional(),
    video: z.string().optional(),
  }))
  .query(({ input }) => {
    const config: Partial<SEOConfig> = input;
    
    const metaTags = generateMetaTags(config);
    const structuredData = generateStructuredData(config);
    
    return {
      metaTags,
      structuredData,
      config,
    };
  });
