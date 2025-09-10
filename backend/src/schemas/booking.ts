import { z } from "zod";

// Validate sessionId in route params
export const sessionIdParamSchema = z.object({
  sessionId: z.string().regex(/^\d+$/, "sessionId must be a number"),
});
