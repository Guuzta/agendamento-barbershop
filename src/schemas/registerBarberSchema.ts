import { z } from "zod";

export const registerBarberSchema = z.object({
  name: z.string().min(4, "Name must contain at least 4 characters"),
});

export type RegisterBarberBody = z.infer<typeof registerBarberSchema>;
