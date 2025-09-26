import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";
import superjson from "superjson";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  // Fallback for development
  if (__DEV__) {
    console.warn('[tRPC] No EXPO_PUBLIC_RORK_API_BASE_URL found, using fallback');
    return 'http://localhost:3000'; // Default fallback
  }

  throw new Error(
    "No base url found, please set EXPO_PUBLIC_RORK_API_BASE_URL"
  );
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
        }).catch((error) => {
          console.error('[tRPC] Request failed:', error);
          throw error;
        });
      },
    }),
  ],
});