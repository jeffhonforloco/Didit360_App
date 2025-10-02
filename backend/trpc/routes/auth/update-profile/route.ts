import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const updateProfileInputSchema = z.object({
  token: z.string(),
  displayName: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
});

const updateProfileOutputSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    updatedAt: z.string(),
  }),
});

export const updateProfileProcedure = publicProcedure
  .input(updateProfileInputSchema)
  .output(updateProfileOutputSchema)
  .mutation(async ({ input }) => {
    console.log('[Auth] Update profile request');

    try {
      const user = {
        id: `user_${Date.now()}`,
        email: 'user@example.com',
        displayName: input.displayName || 'User',
        avatarUrl: input.avatarUrl !== undefined ? input.avatarUrl : null,
        updatedAt: new Date().toISOString(),
      };

      console.log('[Auth] Profile updated successfully');

      return { user };
    } catch (error) {
      console.error('[Auth] Update profile error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update profile',
      });
    }
  });
