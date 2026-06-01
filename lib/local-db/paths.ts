import path from "node:path";

export const LOCAL_DB_DIR = path.join(process.cwd(), ".local");
export const LOCAL_DB_PATH = path.join(LOCAL_DB_DIR, "codex-visual-office.db");

// Phase 2 Step 1 only defines the path. UI integration starts in a later step.
