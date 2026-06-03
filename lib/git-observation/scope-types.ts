import type { FileChange, ScopeCheckRuleResult, ScopeCheckStatus } from "@/lib/types";

export type ScopeCheckSource = "path_level_forbidden_scope";

export interface ForbiddenScopeCheckInput {
  forbiddenScope: string[];
  changedFiles: Pick<FileChange, "filePath">[];
}

export interface ForbiddenScopeCheckResult {
  status: ScopeCheckStatus;
  forbiddenScope: string[];
  matchedFiles: string[];
  unmatchedFiles: string[];
  ruleResults: ScopeCheckRuleResult[];
  reason: string;
  checkSource: ScopeCheckSource;
}
