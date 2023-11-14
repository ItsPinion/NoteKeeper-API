import {
  mysqlTable,
  bigint,
  text,
  varchar,
  datetime,
} from "drizzle-orm/mysql-core";
import { db } from "./db";
import { eq } from "drizzle-orm";

const tableName = "notes";

export const notesSchema = mysqlTable(tableName, {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),
  text: varchar("phone", { length: 256 }).notNull(),
  date: datetime("date").notNull(),
});

export type Note = typeof notesSchema.$inferSelect;

export async function createNote(newNote: Partial<Note>) {
  if (!newNote.date || !newNote.text) {
    throw new Error("note date & text required");
  }
  await db.insert(notesSchema).values({
    text: newNote.text,
    date: newNote.date,
  });
  return { message: "success" };
}

export async function getOneNote(id: number) {
  const result = await db
    .select()
    .from(notesSchema)
    .where(eq(notesSchema.id, id));
  return result[0];
}

export async function updateNote(id: number, newNote: Partial<Note>) {
  if (!newNote.date || !newNote.text) {
    throw new Error("note date & text required");
  }

  await db
    .update(notesSchema)
    .set({ id: id, text: newNote.text, date: newNote.date })
    .where(eq(notesSchema.id, id));
  return { message: "successfully updated" };
}

export async function deleteNote(id: number) {
  await db.delete(notesSchema).where(eq(notesSchema.id, id));
  return { message: "successfully deleted" };
}

export async function getAll() {
  const result: Note[] = await db.select().from(notesSchema);
  return result;
}
