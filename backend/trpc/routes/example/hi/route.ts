import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

// Export both query and mutation versions for flexibility
export const hiQuery = publicProcedure
  .input(z.object({ name: z.string() }))
  .query(({ input }: { input: { name: string } }) => {
    console.log('[Hi Query] Received input:', input);
    const response = {
      hello: `Hello ${input.name}! Backend is connected and working.`,
      date: new Date(),
      timestamp: Date.now(),
      success: true,
    };
    console.log('[Hi Query] Sending response:', response);
    return response;
  });

export const hiMutation = publicProcedure
  .input(z.object({ name: z.string() }))
  .mutation(({ input }: { input: { name: string } }) => {
    console.log('[Hi Mutation] Received input:', input);
    const response = {
      hello: `Hello ${input.name}! Backend is connected and working.`,
      date: new Date(),
      timestamp: Date.now(),
      success: true,
    };
    console.log('[Hi Mutation] Sending response:', response);
    return response;
  });

// Default export for backward compatibility
export default hiMutation;