import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

export default publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }: { input: { name: string } }) => {
    console.log('[Hi Route] Received input:', input);
    const response = {
      hello: `Hello ${input.name}! Backend is connected and working.`,
      date: new Date(),
      timestamp: Date.now(),
      success: true,
    };
    console.log('[Hi Route] Sending response:', response);
    return response;
  });