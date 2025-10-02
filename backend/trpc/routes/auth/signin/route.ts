import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const signinInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signinOutputSchema = z.object({
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

export const signinProcedure = publicProcedure
  .input(signinInputSchema)
  .output(signinOutputSchema)
  .mutation(async ({ input }) => {
    console.log('[Auth] Signin request:', { email: input.email });

    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
      const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;

      const user = {
        id: userId,
        email: input.email,
        displayName: input.email.split('@')[0],
        avatarUrl: null,
        createdAt: new Date().toISOString(),
      };

      console.log('[Auth] User signed in successfully:', user.id);

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error) {
      console.error('[Auth] Signin error:', error);
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }
  });
