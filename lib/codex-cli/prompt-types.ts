import type { Project, Task } from "@/lib/types";

export interface CodexPromptInput {
  project: Pick<Project, "name" | "phase" | "status" | "localPathPlaceholder">;
  task: Pick<Task, "title" | "status" | "acceptanceCriteria" | "forbiddenScope" | "changedFiles"> & {
    summary?: string;
  };
}

export interface CodexPromptResult {
  prompt: string;
  generatedAt: string;
  mode: "prompt_handoff_only";
}

export type CodexPromptHandoffMode = "mark_ready" | "dry_run_dispatch";

export interface CodexPromptHandoffResult {
  ok: boolean;
  taskId: string;
  mode: CodexPromptHandoffMode;
  eventId?: string;
  message?: string;
  error?: string;
  cliTaskExecutionAttempted: false;
}
