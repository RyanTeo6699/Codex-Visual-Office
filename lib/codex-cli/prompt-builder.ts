import type { CodexPromptInput, CodexPromptResult } from "./prompt-types";

function renderList(items: string[]): string {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- None provided";
}

export function buildCodexTaskPrompt(input: CodexPromptInput): CodexPromptResult {
  const generatedAt = new Date().toISOString();
  const taskSummary = input.task.summary?.trim() || "No task summary provided.";

  const prompt = [
    "You are Codex working on a local task from Codex Visual Office.",
    "",
    "Important boundaries:",
    "- Stay within the task scope below.",
    "- Do not exceed the forbidden scope.",
    "- Do not read or expose secrets.",
    "- Do not run deployment or remote service actions unless the user separately approves them.",
    "",
    "Project:",
    `- Name: ${input.project.name}`,
    `- Phase: ${input.project.phase}`,
    `- Status: ${input.project.status}`,
    `- Local path label: ${input.project.localPathPlaceholder}`,
    "",
    "Task:",
    `- Title: ${input.task.title}`,
    `- Summary: ${taskSummary}`,
    `- Current status: ${input.task.status}`,
    "",
    "Acceptance criteria:",
    renderList(input.task.acceptanceCriteria),
    "",
    "Forbidden scope:",
    renderList(input.task.forbiddenScope),
    "",
    "Mock changed files / expected work surface:",
    renderList(input.task.changedFiles),
    "",
    "Required response after work:",
    "- Summarize what changed.",
    "- List files changed.",
    "- List verification commands run and their results.",
    "- Call out anything not completed.",
    "",
    "Do not exceed this task scope.",
  ].join("\n");

  return {
    prompt,
    generatedAt,
    mode: "prompt_handoff_only",
  };
}
