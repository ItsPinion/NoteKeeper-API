import {
  mysqlTable,
  bigint,
  text,
  varchar,
  datetime,
} from "drizzle-orm/mysql-core";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { Note, Result } from "./types";

const tableName = "notes";

export const notesSchema = mysqlTable(tableName, {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  text: varchar("phone", { length: 256 }).notNull(),
  date: datetime("date").notNull(),
});

export async function createNote(newNote: Partial<Note>): Promise<Result> {
  if (!newNote.date || !newNote.text) {
    throw new Error("note date & text required");
  }
  await db.insert(notesSchema).values({
    text: newNote.text,
    date: newNote.date,
  });
  return { success: true, message: "The note has been added successfully" };
}

export async function readNotebyID(id: number): Promise<Note> {
  const result = await db
    .select()
    .from(notesSchema)
    .where(eq(notesSchema.id, id));
  return result[0];
}

export async function readNotebyText(text: string): Promise<Note> {
  const result = await db
    .select()
    .from(notesSchema)
    .where(eq(notesSchema.text, text));

  return result[0];
}

export async function updateNote(
  id: number,
  newNote: Partial<Note>
): Promise<Result> {
  if (!newNote.date || !newNote.text) {
    throw new Error("note date & text required");
  }

  await db
    .update(notesSchema)
    .set({ id: id, text: newNote.text, date: newNote.date })
    .where(eq(notesSchema.id, id));
  return { success: true, message: "note has been updated successfully" };
}

export async function deleteNote(id: number): Promise<Result> {
  await db.delete(notesSchema).where(eq(notesSchema.id, id));
  return { success: true, message: "note has been deleted successfully" };
}

export async function listNotes(): Promise<Note[]> {
  const result: Note[] = await db.select().from(notesSchema);
  return result;
}
