import { notesSchema } from "./note";

export type Note = typeof notesSchema.$inferSelect;
export type Result = {
  success: boolean;
  message: string;
};
