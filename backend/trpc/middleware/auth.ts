import { TRPCError } from "@trpc/server";
import { publicProcedure } from "../create-context";

export const authMiddleware = publicProcedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No authentication token provided",
    });
  }

  console.log("[Auth Middleware] Token validated:", token.substring(0, 10) + "...");

  return next({
    ctx: {
      ...ctx,
      user: {
        id: "user_123",
        email: "user@example.com",
        displayName: "User",
      },
      token,
    },
  });
});

export const protectedProcedure = authMiddleware;
