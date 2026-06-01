import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { LOCAL_DB_DIR, LOCAL_DB_PATH } from "./paths";
import * as schema from "./schema";

// Server-only / Node-only local database client.
// Do not import this module from client components or current UI pages.
mkdirSync(LOCAL_DB_DIR, { recursive: true });

const sqlite = new Database(LOCAL_DB_PATH);

export const db = drizzle(sqlite, { schema });
export const sqliteClient = sqlite;

export type LocalDb = typeof db;
