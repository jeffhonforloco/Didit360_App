import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  // For web, prioritize the current origin (this works for both dev and production)
  if (typeof window !== 'undefined' && window.location) {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    console.log('[tRPC] Using web origin:', baseUrl);
    return baseUrl;
  }

  // Then try environment variable
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('[tRPC] Using base URL from env:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }
  
  // For mobile development, try common development URLs
  if (__DEV__) {
    console.warn('[tRPC] No EXPO_PUBLIC_RORK_API_BASE_URL found, using mobile fallback');
    // Try localhost first, then common development IPs
    return 'http://localhost:3000';
  }

  // Production fallback - check if we're in a deployed environment
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('[tRPC] Production environment detected, using current host');
    return typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : 'https://didit360.com';
  }

  // Development fallback
  console.error('[tRPC] No base URL found, using development fallback');
  return 'http://localhost:3000';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
      headers() {
        try {
          const obs = (globalThis as any).__OBS as { sessionId?: string; traceId?: string } | undefined;
          return {
            'x-session-id': obs?.sessionId ?? '',
            'x-trace-id': obs?.traceId ?? '',
          } as Record<string, string>;
        } catch (error) {
          console.warn('[tRPC] Error getting headers:', error);
          return {} as Record<string, string>;
        }
      },
      async fetch(url, options) {
        console.log('[tRPC] Making request to:', url);
        console.log('[tRPC] Request options:', {
          method: options?.method || 'GET',
          headers: options?.headers,
          body: options?.body ? 'present' : 'none'
        });
        
        // Create timeout signal if AbortSignal.timeout is available
        let timeoutSignal;
        try {
          if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
            timeoutSignal = AbortSignal.timeout(30000); // 30 second timeout
          }
        } catch (e) {
          console.warn('[tRPC] AbortSignal.timeout not available:', e);
        }
        
        try {
          const response = await fetch(url, {
            ...options,
            signal: timeoutSignal || options?.signal,
          });
          
          console.log('[tRPC] Response status:', response.status, response.statusText);
          console.log('[tRPC] Response headers:', Object.fromEntries(response.headers.entries()));
          
          if (!response.ok) {
            const urlString = typeof url === 'string' ? url : url.toString();
            const isSilentEndpoint = urlString.includes('auralora') || urlString.includes('voxsaga') || urlString.includes('didit360news');
            
            if (!isSilentEndpoint) {
              console.error('[tRPC] HTTP error:', response.status, response.statusText);
              
              try {
                const errorText = await response.text();
                console.error('[tRPC] Error response body:', errorText);
              } catch (e) {
                console.warn('[tRPC] Could not read error response body:', e);
              }
            }
          }
          
          return response;
        } catch (error: any) {
          const urlString = typeof url === 'string' ? url : url.toString();
          const isSilentEndpoint = urlString.includes('auralora') || urlString.includes('voxsaga') || urlString.includes('didit360news');
          
          if (!isSilentEndpoint) {
            console.error('[tRPC] Request failed:', {
              url,
              error: error.message,
              name: error.name,
              stack: error.stack
            });
          }
          throw error;
        }
      },
    }),
  ],
});