import { sqliteClient } from "./client";

// Creates Phase 2 local tables if they are missing.
// This is intentionally non-destructive; it does not drop or reset data.
export function initializeLocalDb(): void {
  sqliteClient.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      phase TEXT NOT NULL,
      status TEXT NOT NULL,
      local_path TEXT,
      accent TEXT NOT NULL DEFAULT 'cyan',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS agent_seats (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      agent_type TEXT NOT NULL DEFAULT 'codex',
      status TEXT NOT NULL,
      current_task_id TEXT,
      current_project_id TEXT REFERENCES projects(id),
      focus TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL,
      priority TEXT NOT NULL,
      assigned_seat_id TEXT REFERENCES agent_seats(id),
      acceptance_criteria_json TEXT NOT NULL DEFAULT '[]',
      forbidden_scope_json TEXT NOT NULL DEFAULT '[]',
      changed_files_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_events (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      seat_id TEXT REFERENCES agent_seats(id),
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS build_checks (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id),
      task_id TEXT REFERENCES tasks(id),
      name TEXT NOT NULL,
      status TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS review_records (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id),
      decision TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      diff_summary_json TEXT NOT NULL DEFAULT '[]',
      risk_notes_json TEXT NOT NULL DEFAULT '[]',
      quality_gate_ids_json TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS git_snapshots (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      snapshot_kind TEXT NOT NULL,
      branch TEXT NOT NULL,
      head_sha TEXT NOT NULL,
      repo_root TEXT NOT NULL,
      porcelain_status TEXT NOT NULL DEFAULT '',
      is_dirty INTEGER NOT NULL,
      status_summary_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS file_changes (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      git_snapshot_id TEXT REFERENCES git_snapshots(id),
      change_status TEXT NOT NULL,
      raw_status TEXT NOT NULL,
      file_path TEXT NOT NULL,
      previous_file_path TEXT,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS diff_summaries (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      git_snapshot_id TEXT REFERENCES git_snapshots(id),
      files_changed INTEGER NOT NULL,
      insertions INTEGER NOT NULL,
      deletions INTEGER NOT NULL,
      numstat_json TEXT NOT NULL DEFAULT '[]',
      stat_summary TEXT NOT NULL DEFAULT '',
      stdout_truncated INTEGER NOT NULL,
      numstat_truncated INTEGER NOT NULL,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scope_checks (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL REFERENCES tasks(id),
      project_id TEXT NOT NULL REFERENCES projects(id),
      status TEXT NOT NULL,
      forbidden_scope_json TEXT NOT NULL DEFAULT '[]',
      matched_files_json TEXT NOT NULL DEFAULT '[]',
      unmatched_files_json TEXT NOT NULL DEFAULT '[]',
      rule_results_json TEXT NOT NULL DEFAULT '[]',
      reason TEXT NOT NULL,
      check_source TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}
