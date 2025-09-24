import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { getLibraryProcedure } from "./routes/library/get-library/route";
import { updateLibraryProcedure } from "./routes/library/update-library/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  library: createTRPCRouter({
    get: getLibraryProcedure,
    update: updateLibraryProcedure,
  }),
});

export type AppRouter = typeof appRouter;