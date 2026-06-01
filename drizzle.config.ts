import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/local-db/schema.ts",
  out: "./lib/local-db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./.local/codex-visual-office.db",
  },
} satisfies Config;
