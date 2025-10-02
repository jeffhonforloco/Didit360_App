import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const signupInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(1),
  avatarUrl: z.string().url().optional().nullable(),
});

const signupOutputSchema = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    displayName: z.string(),
    avatarUrl: z.string().nullable(),
    createdAt: z.string(),
  }),
  token: z.string(),
  refreshToken: z.string(),
});

export const signupProcedure = publicProcedure
  .input(signupInputSchema)
  .output(signupOutputSchema)
  .mutation(async ({ input }) => {
    console.log('[Auth] Signup request:', { email: input.email, displayName: input.displayName });

    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

      const user = {
        id: userId,
        email: input.email,
        displayName: input.displayName,
        avatarUrl: input.avatarUrl || null,
        createdAt: new Date().toISOString(),
      };

      console.log('[Auth] User created successfully:', user.id);

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error) {
      console.error('[Auth] Signup error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create account',
      });
    }
  });
