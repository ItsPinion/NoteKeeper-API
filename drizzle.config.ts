import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/note.ts",
  out: "./drizzle",
} satisfies Config;
