import { z } from "zod";
import { publicProcedure } from "../../../../create-context";
import { ddl, fullDDL } from "@/backend/db/schema";

export const getDDLProcedure = publicProcedure
  .input(z.object({ section: z.enum(["core", "ingest", "indexes", "all"]).default("all") }))
  .output(
    z.object({
      section: z.string(),
      sql: z.string(),
    })
  )
  .query(async ({ input }) => {
    const sql = input.section === "all" ? fullDDL : ddl[input.section];
    return { section: input.section, sql };
  });
