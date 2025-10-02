import { publicProcedure } from '../../../create-context';
import { z } from 'zod';
import { detectAISearchBot } from '@/lib/seo';

export const detectBotProcedure = publicProcedure
  .input(z.object({
    userAgent: z.string(),
  }))
  .query(({ input }) => {
    const detection = detectAISearchBot(input.userAgent);
    
    console.log('[SEO] Bot detection:', {
      userAgent: input.userAgent,
      detection,
    });
    
    return {
      ...detection,
      timestamp: new Date().toISOString(),
    };
  });
