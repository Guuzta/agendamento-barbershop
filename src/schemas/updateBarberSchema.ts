import { z } from "zod";

export const updateBarberSchema = z.object({
  name: z.string().min(4, "Name must contain at least 4 characters"),
});

export type UpdateBarberBody = z.infer<typeof updateBarberSchema>;
