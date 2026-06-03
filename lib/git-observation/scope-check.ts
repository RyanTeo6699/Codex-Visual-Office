import type { ScopeCheckRuleResult } from "@/lib/types";
import type { ForbiddenScopeCheckInput, ForbiddenScopeCheckResult } from "./scope-types";

type ScopeCategory = ScopeCheckRuleResult["category"];

interface CategoryRule {
  category: Exclude<ScopeCategory, "generic" | "unknown">;
  hints: string[];
  strongPatterns: string[];
  weakPatterns: string[];
}

const categoryRules: CategoryRule[] = [
  {
    category: "supabase",
    hints: ["supabase"],
    strongPatterns: ["supabase/", "migrations/", "migration", ".sql"],
    weakPatterns: ["schema", "sql"],
  },
  {
    category: "auth",
    hints: ["auth", "login", "session", "permission"],
    strongPatterns: ["auth", "login", "session", "middleware", "proxy", "permissions"],
    weakPatterns: ["user", "role"],
  },
  {
    category: "payment",
    hints: ["payment", "billing", "stripe", "checkout", "subscription"],
    strongPatterns: ["payment", "billing", "stripe", "checkout", "subscription"],
    weakPatterns: ["invoice", "plan"],
  },
  {
    category: "deploy",
    hints: ["deploy", "deployment", "vercel", "docker", "nginx", "pm2", "env"],
    strongPatterns: ["vercel", "deploy", "docker", "nginx", "pm2", ".env"],
    weakPatterns: ["env", "config"],
  },
];

const genericStopWords = new Set([
  "and",
  "any",
  "change",
  "changes",
  "code",
  "config",
  "file",
  "files",
  "logic",
  "modify",
  "not",
  "scope",
  "touch",
  "update",
  "with",
]);

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function extractGenericTokens(rule: string): string[] {
  return unique(normalize(rule)
    .split(/[^a-z0-9_.-]+/)
    .filter((token) => token.length >= 4 && !genericStopWords.has(token)));
}

function resolveCategory(rule: string): CategoryRule | undefined {
  const normalizedRule = normalize(rule);
  return categoryRules.find((candidate) => candidate.hints.some((hint) => normalizedRule.includes(hint)));
}

function matchPattern(filePath: string, pattern: string): boolean {
  const normalizedFilePath = normalize(filePath);
  const normalizedPattern = normalize(pattern);

  if (normalizedPattern.endsWith("/")) {
    return normalizedFilePath.startsWith(normalizedPattern) || normalizedFilePath.includes(`/${normalizedPattern}`);
  }

  return normalizedFilePath.includes(normalizedPattern);
}

function buildCategoryRuleResult(rule: string, categoryRule: CategoryRule, filePaths: string[]): ScopeCheckRuleResult {
  const strongMatches = filePaths.filter((filePath) => categoryRule.strongPatterns.some((pattern) => matchPattern(filePath, pattern)));
  const weakMatches = filePaths.filter((filePath) => {
    if (strongMatches.includes(filePath)) {
      return false;
    }
    return categoryRule.weakPatterns.some((pattern) => matchPattern(filePath, pattern));
  });
  const matchedFiles = unique([...strongMatches, ...weakMatches]);
  const matchStrength = strongMatches.length > 0 ? "strong" : weakMatches.length > 0 ? "weak" : "none";
  const status = matchStrength === "strong" ? "blocked" : matchStrength === "weak" ? "warning" : "pass";

  return {
    rule,
    parsed: true,
    category: categoryRule.category,
    matchStrength,
    status,
    matchedFiles,
    reason: matchedFiles.length
      ? `${categoryRule.category} rule matched ${matchedFiles.length} changed file path(s).`
      : `${categoryRule.category} rule did not match changed file paths.`,
  };
}

function buildGenericRuleResult(rule: string, filePaths: string[]): ScopeCheckRuleResult {
  const tokens = extractGenericTokens(rule);

  if (tokens.length === 0) {
    return {
      rule,
      parsed: false,
      category: "unknown",
      matchStrength: "none",
      status: "warning",
      matchedFiles: [],
      reason: "Rule could not be mapped to a path-level pattern, so the scope guard returns warning.",
    };
  }

  const matchedFiles = filePaths.filter((filePath) => tokens.some((token) => matchPattern(filePath, token)));

  return {
    rule,
    parsed: true,
    category: "generic",
    matchStrength: matchedFiles.length > 0 ? "weak" : "none",
    status: matchedFiles.length > 0 ? "warning" : "pass",
    matchedFiles,
    reason: matchedFiles.length
      ? `Generic keyword rule matched ${matchedFiles.length} changed file path(s).`
      : "Generic keyword rule did not match changed file paths.",
  };
}

function rankStatus(statuses: Array<ScopeCheckRuleResult["status"]>): ForbiddenScopeCheckResult["status"] {
  if (statuses.includes("blocked")) {
    return "blocked";
  }

  if (statuses.includes("warning")) {
    return "warning";
  }

  return "pass";
}

export function checkForbiddenScope(input: ForbiddenScopeCheckInput): ForbiddenScopeCheckResult {
  const forbiddenScope = input.forbiddenScope.map((rule) => rule.trim()).filter(Boolean);
  const filePaths = unique(input.changedFiles.map((change) => change.filePath).filter(Boolean));

  if (forbiddenScope.length === 0) {
    return {
      status: "pass",
      forbiddenScope,
      matchedFiles: [],
      unmatchedFiles: filePaths,
      ruleResults: [],
      reason: "No forbidden scope rules were provided.",
      checkSource: "path_level_forbidden_scope",
    };
  }

  const ruleResults = forbiddenScope.map((rule) => {
    const categoryRule = resolveCategory(rule);
    return categoryRule ? buildCategoryRuleResult(rule, categoryRule, filePaths) : buildGenericRuleResult(rule, filePaths);
  });

  const matchedFiles = unique(ruleResults.flatMap((result) => result.matchedFiles));
  const matchedFileSet = new Set(matchedFiles);
  const unmatchedFiles = filePaths.filter((filePath) => !matchedFileSet.has(filePath));
  const status = rankStatus(ruleResults.map((result) => result.status));

  return {
    status,
    forbiddenScope,
    matchedFiles,
    unmatchedFiles,
    ruleResults,
    reason: buildReason(status, ruleResults, matchedFiles.length),
    checkSource: "path_level_forbidden_scope",
  };
}

function buildReason(status: ForbiddenScopeCheckResult["status"], ruleResults: ScopeCheckRuleResult[], matchedFileCount: number): string {
  const unparsedCount = ruleResults.filter((result) => !result.parsed).length;

  if (status === "blocked") {
    return `Blocked because a high-risk forbidden scope pattern matched ${matchedFileCount} changed file path(s).`;
  }

  if (status === "warning" && matchedFileCount > 0) {
    return `Warning because a weak forbidden scope pattern matched ${matchedFileCount} changed file path(s).`;
  }

  if (status === "warning" && unparsedCount > 0) {
    return `Warning because ${unparsedCount} forbidden scope rule(s) could not be parsed into path-level patterns.`;
  }

  return "Pass because changed file paths did not match forbidden scope rules.";
}
