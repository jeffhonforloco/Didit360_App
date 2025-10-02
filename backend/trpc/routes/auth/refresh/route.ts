import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const refreshInputSchema = z.object({
  refreshToken: z.string(),
});

const refreshOutputSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export const refreshProcedure = publicProcedure
  .input(refreshInputSchema)
  .output(refreshOutputSchema)
  .mutation(async ({ input }) => {
    console.log('[Auth] Token refresh request');

    try {
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

      console.log('[Auth] Token refreshed successfully');

      return {
        token,
        refreshToken,
      };
    } catch (error) {
      console.error('[Auth] Refresh error:', error);
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }
  });
