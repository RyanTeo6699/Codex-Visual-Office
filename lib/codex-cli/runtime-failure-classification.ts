import type { CodexFailureCategory, CodexRuntimeFailureClassification } from "./runtime-status-types";

export const runtimeFailurePreviewLimit = 1200;

const sensitivePatterns: Array<[RegExp, string]> = [
  [/\b(?:OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD)\b\s*[:=]\s*\S+/gi, "[redacted-value]"],
  [/\b(?:OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD)\b/gi, "[redacted-marker]"],
  [/~\/\.codex\/auth\.json/gi, "[redacted-path]"],
  [/~\/\.codex/gi, "[redacted-path]"],
  [/\bauth\.json\b/gi, "[redacted-file]"],
  [/\b\.env(?:\.local)?\b/gi, "[redacted-file]"],
  [/sk-[a-z0-9_-]+/gi, "[redacted-value]"],
];

export function redactRuntimeStatusText(value: string): string {
  return sensitivePatterns.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

export function createBoundedRuntimePreview(value: string | undefined, limit = runtimeFailurePreviewLimit): { preview: string; truncated: boolean } {
  const redacted = redactRuntimeStatusText(value ?? "").trim();
  const truncated = redacted.length > limit;

  return {
    preview: truncated ? redacted.slice(0, limit) : redacted,
    truncated,
  };
}

export interface ClassifyCodexRuntimeFailureInput {
  status?: string;
  exitCode?: number;
  stdoutPreview?: string;
  stderrPreview?: string;
  outputPreview?: string;
  errorPreview?: string;
  reasons?: string[];
  timedOut?: boolean;
  parseError?: boolean;
}

function joinedFailureText(input: ClassifyCodexRuntimeFailureInput): string {
  return [
    input.status,
    input.exitCode === undefined ? undefined : `exitCode=${input.exitCode}`,
    input.errorPreview,
    input.stderrPreview,
    input.outputPreview,
    input.stdoutPreview,
    ...(input.reasons ?? []),
  ]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join("\n");
}

function categoryFromText(text: string, input: ClassifyCodexRuntimeFailureInput): CodexFailureCategory {
  const normalized = text.toLowerCase();

  if (input.parseError || /parse|invalid json|malformed json/.test(normalized)) {
    return "output_parse_error";
  }

  if (input.timedOut || /timed?\s*out|timeout|deadline exceeded|signal sigterm|signal sigkill/.test(normalized)) {
    return "timeout";
  }

  if (/codex(?: cli)? (?:is )?(?:not installed|not found|missing)|command not found|enoent|which codex/.test(normalized)) {
    return "missing_cli";
  }

  if (/approved project path|missing approved path|project path is not approved|not approved/.test(normalized)) {
    return "missing_approved_path";
  }

  if (/auth|login|required credential|missing credential|unauthorized|not authenticated|api key required/.test(normalized)) {
    return "auth_required_or_missing";
  }

  if (/sandbox|operation not permitted|permission denied|eacces|eperm/.test(normalized)) {
    return "sandbox_denied";
  }

  if (/policy|forbidden|not allowlisted|explicit confirmation|prompt preview|acknowledgement|blocked/.test(normalized)) {
    return "policy_blocked";
  }

  if (typeof input.exitCode === "number" && input.exitCode !== 0) {
    return "nonzero_exit";
  }

  return "unknown";
}

function reasonForCategory(category: CodexFailureCategory, input: ClassifyCodexRuntimeFailureInput): string {
  if (category === "nonzero_exit" && typeof input.exitCode === "number") {
    return `Codex exited with non-zero code ${input.exitCode}.`;
  }

  const reasons = input.reasons?.filter(Boolean);
  if (reasons?.length) {
    return createBoundedRuntimePreview(reasons.join(" ")).preview;
  }

  switch (category) {
    case "missing_cli":
      return "Codex CLI was not found by local detection.";
    case "auth_required_or_missing":
      return "Codex appears to require authentication or local auth is missing.";
    case "missing_approved_path":
      return "An approved project path is required before running Codex.";
    case "policy_blocked":
      return "Runtime policy blocked the Codex run.";
    case "sandbox_denied":
      return "The run was denied by sandbox or local permissions.";
    case "timeout":
      return "The Codex run timed out.";
    case "output_parse_error":
      return "Codex output could not be parsed.";
    case "unknown":
      return "Codex runtime failure could not be classified.";
    default:
      return "Codex runtime failure was classified.";
  }
}

export function classifyCodexRuntimeFailure(input: string | ClassifyCodexRuntimeFailureInput): CodexRuntimeFailureClassification {
  const normalizedInput = typeof input === "string" ? { errorPreview: input } : input;
  const text = joinedFailureText(normalizedInput);
  const category = categoryFromText(text, normalizedInput);
  const bounded = createBoundedRuntimePreview(text);

  return {
    category,
    reason: reasonForCategory(category, normalizedInput),
    exitCode: normalizedInput.exitCode,
    preview: bounded.preview,
    previewTruncated: bounded.truncated,
  };
}
