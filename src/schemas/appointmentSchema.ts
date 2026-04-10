import { z } from "zod";

export const appointmentSchema = z.object({
  userId: z
    .number("userId must be a number")
    .int("userId must be an int number"),
  barberId: z
    .number("barberId must be a number")
    .int("barberId must be an int number"),
  date: z.iso.datetime(),
});

export type AppointmentBody = z.infer<typeof appointmentSchema>;
