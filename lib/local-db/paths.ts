import path from "node:path";

const configuredDbPath = process.env.CVO_LOCAL_DB_PATH?.trim();

export const LOCAL_DB_PATH = configuredDbPath
  ? path.resolve(configuredDbPath)
  : path.join(process.cwd(), ".local", "codex-visual-office.sqlite");
export const LOCAL_DB_DIR = path.dirname(LOCAL_DB_PATH);

// Phase 2 Step 1 only defines the path. UI integration starts in a later step.
