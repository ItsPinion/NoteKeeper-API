import {
  createNote,
  readNotebyID,
  updateNote,
  deleteNote,
  listNotes,
  readNotebyText,
} from "./note";
import {
  createNoteSchema,
  paramSchema,
  querySchema,
  updateNoteSchema,
} from "./schema";
import { Note, Result } from "./types";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { etag } from "hono/etag";
import { timing } from "hono/timing";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { secureHeaders } from "hono/secure-headers";

const app = new Hono();

{
  app.use(
    "*",
    basicAuth({
      username: `${process.env.PMA_USER}`,
      password: `${process.env.MYSQL_ROOT_PASSWORD}`,
    })
  );
  app.use("*", compress());
  app.use("*", cors());
  // app.use("*", etag());
  app.use("*", timing());
  app.use("*", logger());
  app.use("*", prettyJSON());
  app.use("*", secureHeaders());
}

{
  app.post("/", async (c) => {
    const data: Partial<Note> = await c.req.json();

    const newNote: Partial<Note> = {
      text: data.text,
      date: new Date(data.date || Date.now()),
    };

    const noteValidation = createNoteSchema.safeParse(newNote);

    if (!noteValidation.success) {
      return c.json(
        { success: false, message: noteValidation.error.issues[0] },
        400
      );
    }

    let duplicate: Note;

    try {
      duplicate = await readNotebyText(newNote.text as string);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }

    if (duplicate) {
      return c.json(
        {
          success: false,
          message: `note already exists.`,
          duplicateOf: duplicate,
        },
        400
      );
    }

    try {
      return c.json(await createNote(newNote));
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }
  });

  app.get("/:id", async (c) => {
    const idValidation = paramSchema.safeParse(+c.req.param("id"));

    if (!idValidation.success) {
      return c.json(
        { success: false, message: idValidation.error.issues[0] },
        400
      );
    }

    let result: Note;

    try {
      result = await readNotebyID(idValidation.data);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }

    if (!result) {
      return c.json({ success: false, message: "note does not exist" }, 404);
    }

    return c.json(result);
  });

  app.put("/:id", async (c) => {
    const idValidation = paramSchema.safeParse(+c.req.param("id"));

    if (!idValidation.success) {
      return c.json(
        { success: false, message: idValidation.error.issues[0] },
        400
      );
    }

    let note: Note;

    try {
      note = await readNotebyID(idValidation.data);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }

    if (!note) {
      return c.json({ success: false, message: "note does not exist" }, 404);
    }

    const data: Partial<Note> = await c.req.json();

    const newNote: Partial<Note> = {
      text: data.text,
      date: new Date(data.date || note.date),
    };

    const noteValidation = updateNoteSchema.safeParse(newNote);

    if (!noteValidation.success) {
      return c.json(
        { success: false, message: noteValidation.error.issues[0] },
        400
      );
    }

    let duplicate: Note;

    try {
      duplicate = await readNotebyText(newNote.text as string);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }

    if (duplicate) {
      return c.json(
        {
          success: false,
          message: `note already exists.`,
          duplicateOf: duplicate,
        },
        400
      );
    }

    try {
      return c.json(await updateNote(idValidation.data, newNote));
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }
  });

  app.delete("/:id", async (c) => {
    const idValidation = paramSchema.safeParse(+c.req.param("id"));

    if (!idValidation.success) {
      return c.json(
        { success: false, message: idValidation.error.issues[0] },
        400
      );
    }

    let result: Note;

    try {
      result = await readNotebyID(idValidation.data);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }

    if (!result) {
      return c.json({ success: false, message: "note does not exist" }, 404);
    }

    try {
      return c.json(await deleteNote(idValidation.data));
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }
  });

  app.get("/", async (c) => {
    const query = {
      page: +(c.req.query("page") || "1"),
      lastID: +(c.req.query("lastID") || "0"),
      limit: +(c.req.query("limit") || "10"),
    };

    const queryValidation = querySchema.safeParse(query);

    if (!queryValidation.success) {
      return c.json(queryValidation.error.issues[0], 400);
    }

    let result: Note[];

    try {
      result = await listNotes(query.page, query.lastID, query.limit);
    } catch (error) {
      return c.json(
        { success: false, message: "Failed to access the database" },
        500
      );
    }

    if (result.length < 1) {
      return c.json({ success: false, message: "nothing to see here :)" }, 404);
    }

    return c.json(result);
  });
}

serve(app);
