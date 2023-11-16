import { z } from "zod";

const noteSchema = z
  .object({
    text: z.string().min(5).max(500),
    date: z.date().min(new Date()),
  })
  .strict();

export const createNoteSchema = noteSchema.partial({
  date: true,
});

export const updateNoteSchema = noteSchema.partial();

export const paramSchema = z.number().positive().int();

export const querySchema = z
  .object({
    limit: paramSchema,
    page: paramSchema,
    lastID: z.number().int().nonnegative(),
  })
  .partial();
