import { z } from "zod";

export const createNoteSchema = z.object({
  text: z.string().min(5).max(500),
  date: z.date().min(new Date()).optional(),
});

export const updateNoteSchema = z.object({
  text: z.string().min(5).max(500).optional(),
  date: z.date().min(new Date()).optional(),
});

export const idParamSchema = z.number().positive().int();
