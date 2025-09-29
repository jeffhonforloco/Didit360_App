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
      fetch(url, options) {
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
        
        return fetch(url, {
          ...options,
          signal: timeoutSignal || options?.signal,
        }).then((response) => {
          console.log('[tRPC] Response status:', response.status, response.statusText);
          if (!response.ok) {
            console.error('[tRPC] HTTP error:', response.status, response.statusText);
          }
          return response;
        }).catch((error) => {
          console.error('[tRPC] Request failed:', {
            url,
            error: error.message,
            name: error.name,
            stack: error.stack
          });
          throw error;
        });
      },
    }),
  ],
});