import { useEffect } from 'react';
import { Platform } from 'react-native';
import type { SEOConfig } from '@/lib/seo';

export function useSEO(config: Partial<SEOConfig>) {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    try {
      if (config.title) {
        document.title = config.title;
      }

      const metaTags = [
        { name: 'description', content: config.description },
        { property: 'og:title', content: config.title },
        { property: 'og:description', content: config.description },
        { property: 'og:image', content: config.image },
        { property: 'og:url', content: config.url },
        { property: 'og:type', content: config.type },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: config.title },
        { name: 'twitter:description', content: config.description },
        { name: 'twitter:image', content: config.image },
      ];

      metaTags.forEach(({ name, property, content }) => {
        if (!content) return;

        const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
        let meta = document.querySelector(selector);

        if (!meta) {
          meta = document.createElement('meta');
          if (name) meta.setAttribute('name', name);
          if (property) meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }

        meta.setAttribute('content', content);
      });

      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (config.url) {
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.rel = 'canonical';
          document.head.appendChild(canonical);
        }
        canonical.href = config.url;
      }
    } catch (error) {
      console.error('[useSEO] Error updating meta tags:', error);
    }
  }, [config]);
}

export function useAIBotDetection() {
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    try {
      const userAgent = navigator.userAgent;
      
      const aiPatterns = [
        /GPTBot/i,
        /ChatGPT-User/i,
        /Google-Extended/i,
        /anthropic-ai/i,
        /ClaudeBot/i,
        /cohere-ai/i,
        /PerplexityBot/i,
        /YouBot/i,
        /Applebot-Extended/i,
      ];

      const isAIBot = aiPatterns.some(pattern => pattern.test(userAgent));

      if (isAIBot) {
        console.log('[AI Bot Detected]', userAgent);
        
        if (typeof window !== 'undefined') {
          (window as any).__AI_BOT_DETECTED = true;
        }
      }
    } catch (error) {
      console.error('[useAIBotDetection] Error:', error);
    }
  }, []);
}
