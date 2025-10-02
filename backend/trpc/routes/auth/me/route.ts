import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const meInputSchema = z.object({
  token: z.string(),
});

const meOutputSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    createdAt: z.string(),
  }),
});

export const meProcedure = publicProcedure
  .input(meInputSchema)
  .output(meOutputSchema)
  .query(async ({ input }) => {
    console.log('[Auth] Get current user request');

    try {
      const user = {
        id: `user_${Date.now()}`,
        email: 'user@example.com',
        displayName: 'User',
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };

      return { user };
    } catch (error) {
      console.error('[Auth] Get user error:', error);
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      });
    }
  });
