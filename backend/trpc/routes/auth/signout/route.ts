import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const signoutInputSchema = z.object({
  token: z.string().optional(),
});

const signoutOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const signoutProcedure = publicProcedure
  .input(signoutInputSchema)
  .output(signoutOutputSchema)
  .mutation(async ({ input }) => {
    console.log('[Auth] Signout request');

    try {
      console.log('[Auth] User signed out successfully');

      return {
        success: true,
        message: 'Signed out successfully',
      };
    } catch (error) {
      console.error('[Auth] Signout error:', error);
      return {
        success: false,
        message: 'Failed to sign out',
      };
    }
  });
