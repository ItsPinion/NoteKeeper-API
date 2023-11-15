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

export const idSchema = z.number().positive().int();