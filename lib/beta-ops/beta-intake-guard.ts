import type { BetaIntakeGuardResult } from "./beta-intake-types";

const sensitivePatterns: Array<{ label: string; pattern: RegExp }> = [
  { label: "placeholder_or_unverified_record", pattern: /PLACEHOLDER_DO_NOT_COUNT|TBD_BY_GM/i },
  { label: "fake_or_seeded_beta_record", pattern: /\b(fake|seeded|sample tester|demo tester)\b/i },
  { label: "codex_auth_file", pattern: /(?:~\/\.codex|\.codex\/auth\.json|auth\.json)/i },
  { label: "environment_file", pattern: /(?:^|[\/\s])\.env(?:\.local)?(?:$|[\s/])/i },
  { label: "token_or_secret_marker", pattern: /OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD|AUTH|Bearer\s+[A-Za-z0-9._-]+/i },
  { label: "private_key_marker", pattern: /BEGIN (?:RSA|OPENSSH|PRIVATE) KEY|id_rsa|id_ed25519/i },
  { label: "sqlite_database_dump", pattern: /codex-visual-office\.sqlite|\.sqlite(?:-wal|-shm)?\b/i },
  { label: "source_dump_marker", pattern: /proprietary source|source dump|source archive|repo archive/i },
];

export function inspectBetaIntakeText(input: string): BetaIntakeGuardResult {
  const violations = sensitivePatterns.filter((rule) => rule.pattern.test(input)).map((rule) => rule.label);
  return {
    safe: violations.length === 0,
    violations,
  };
}

export function assertSafeBetaIntakeFields(fields: Record<string, string | undefined | null>): void {
  const combined = Object.entries(fields)
    .map(([key, value]) => `${key}: ${value ?? ""}`)
    .join("\n");
  const result = inspectBetaIntakeText(combined);

  if (!result.safe) {
    throw new Error(`Beta intake rejected sensitive or invalid local input: ${result.violations.join(", ")}`);
  }
}

export function truncateBetaIntakeText(value: string | undefined | null, maxLength = 1200): string {
  const text = (value ?? "").trim();
  return text.length > maxLength ? `${text.slice(0, maxLength)}...[truncated]` : text;
}
