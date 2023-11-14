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
import {
  Note,
  createNote,
  deleteNote,
  getAll,
  getOneNote,
  updateNote,
} from "./note";

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
{
  app.post("/", async (c) => {
    const data: Partial<Note> = await c.req.json();

    const newNote = {
      text: data.text,
      date: new Date(data.date || Date.now()),
    };

    return c.json(await createNote(newNote));
  });

  app.get("/:id", async (c) => c.json(await getOneNote(+c.req.param("id"))));

  app.put("/:id", async (c) => {
    const data: Partial<Note> = await c.req.json();
    const id = +c.req.param("id");

    const note = await getOneNote(id);

    const newNote: Partial<Note> = {
      text: data.text || note.text,
      date: new Date(data.date || note.date),
    };

    return c.json(await updateNote(id, newNote));
  });

  app.delete("/:id", async (c) => c.json(await deleteNote(+c.req.param("id"))));

  app.get("/", async (c) => c.json(await getAll()));
}

serve(app);
