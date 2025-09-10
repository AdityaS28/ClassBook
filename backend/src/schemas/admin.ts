import { z } from "zod";

// Create Class
export const createClassSchema = z.object({
  name: z.string().min(1, "Class name is required"),
});

// Create Session
export const createSessionSchema = z.object({
  dateTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid dateTime",
  }),
  capacity: z.number().int().positive("Capacity must be positive"),
});
