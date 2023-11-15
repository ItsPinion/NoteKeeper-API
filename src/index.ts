import { createNote, readNote, updateNote, deleteNote, listNote } from "./note";
import { createNoteSchema, idSchema } from "./schema";
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

////////////////////////////////////////
////////////   Middleware   ////////////
////////////////////////////////////////
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
  app.use("*", etag());
  app.use("*", timing());
  app.use("*", logger());
  app.use("*", prettyJSON());
  app.use("*", secureHeaders());
}

////////////////////////////////////////
///////////////   API   ////////////////
////////////////////////////////////////

/*TODO: 1. DATA validation
         2. Error handeling
         3.
 */

{
  app.post("/", async (c) => {
    const data: Partial<Note> = await c.req.json();

    const validation = createNoteSchema.safeParse(data);

    if (!validation.success) {
      return c.json({ success: false, message: validation.error.issues[0] },400);
    }

    const newNote: Partial<Note> = {
      text: data.text,
      date: new Date(data.date || Date.now()),
    };

    let result:Result;

    try {
      result = await createNote(newNote);
    } catch (error) {
      return c.json({
        success: false,
        message: "The note could not be added successfully.",
      },500);
    }

    return c.json(result);
  });

  // app.get("/:id", async (c) => c.json(await readNote(+c.req.param("id"))));
  app.get("/:id", async (c) => {
    
    const idValidation = idSchema.safeParse(+c.req.param("id"))

    // if()



  });


  app.put("/:id", async (c) => {
    const data: Partial<Note> = await c.req.json();
    const id = +c.req.param("id");

    const note = await readNote(id);

    const newNote: Partial<Note> = {
      text: data.text || note.text,
      date: new Date(data.date || note.date),
    };

    return c.json(await updateNote(id, newNote));
  });

  app.delete("/:id", async (c) => c.json(await deleteNote(+c.req.param("id"))));

  app.get("/", async (c) => c.json(await listNote()));
}

serve(app);
