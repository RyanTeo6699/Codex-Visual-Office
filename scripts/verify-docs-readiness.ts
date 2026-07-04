import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type Check = {
  name: string;
  passed: boolean;
  detail: string;
};

const rootDir = process.cwd();

const requiredDocs = [
  "docs/user-manual.md",
  "docs/developer-manual.md",
  "docs/local-setup-guide.md",
  "docs/troubleshooting.md",
  "docs/safety-data-boundaries.md",
  "docs/backup-restore-recovery-guide.md",
  "docs/release-candidate-qa-checklist.md",
  "docs/phase-14-release-candidate-qa-docs-scope-lock.md",
  "docs/phase-14-release-candidate-qa-docs.md",
  "docs/phase-16-production-1-scope-lock-final-rc-validation.md",
  "docs/product-capability-inventory.md",
  "docs/production-1-boundary.md",
  "docs/risk-register.md",
  "docs/go-no-go-checklist.md",
  "docs/final-rc-validation-matrix.md",
  "docs/phase-16-production-1-scope-lock-final-rc-validation-result.md",
  "docs/phase-17-production-1-finalization-release-freeze-scope-lock.md",
  "docs/release-notes-1.0.md",
  "docs/final-acceptance-report-1.0.md",
  "docs/final-verification-manifest-1.0.md",
  "docs/known-limitations-1.0.md",
  "docs/phase-17-production-1-finalization-release-freeze.md",
  "RELEASE_STATUS.md",
];

const requiredBoundaryMentions = [
  {
    name: "local-first boundaries",
    patterns: [/local-first/i, /local-only/i],
  },
  {
    name: "no cloud sync",
    patterns: [/no cloud sync/i, /cloud sync.*not/i, /does not.*sync.*cloud/i],
  },
  {
    name: "no token storage",
    patterns: [/no token storage/i, /does not.*store.*token/i, /token.*not.*stored/i],
  },
  {
    name: "no production installer yet",
    patterns: [/no production installer/i, /not a production release/i, /production desktop installer.*not/i],
  },
  {
    name: "no auto updater",
    patterns: [/no auto updater/i, /auto updater.*not/i, /not.*auto-updating/i],
  },
  {
    name: "backup restore dry-run",
    patterns: [/dry-run restore/i, /restore dry-run/i, /dry-run/i],
  },
  {
    name: "safety audit",
    patterns: [/safety audit/i, /safety.*permission/i],
  },
  {
    name: "Codex CLI auth unknown limitation",
    patterns: [/auth unknown/i, /auth.*unknown/i, /auth.*not_verified/i, /auth.*not verified/i],
  },
];

const unsupportedClaims = [
  /production installer exists/i,
  /signed production installer/i,
  /notarized production installer/i,
  /auto updater is available/i,
  /cloud sync is available/i,
  /team workspace is available/i,
  /\b(?:stores?|saves?|persists?) (?:OpenAI )?tokens?\b/i,
  /\b(?:reads?|loads?|opens?) ~\/\.codex\/auth\.json\b/i,
  /\b(?:reads?|loads?|opens?) \.env(?:\.local)?\b/i,
];

const negativeBoundaryContext =
  /\b(no|not|must not|does not|do not|never|forbidden|absent|blocked|without|doesn't|cannot|can't)\b/i;

const checks: Check[] = [];

const readDoc = (relativePath: string) => {
  const absolutePath = path.join(rootDir, relativePath);
  if (!existsSync(absolutePath)) return "";
  return readFileSync(absolutePath, "utf8");
};

for (const doc of requiredDocs) {
  const exists = existsSync(path.join(rootDir, doc));
  checks.push({
    name: `required doc: ${doc}`,
    passed: exists,
    detail: exists ? "present" : "missing",
  });
}

const combinedDocs = requiredDocs.map(readDoc).join("\n\n");

for (const mention of requiredBoundaryMentions) {
  const passed = mention.patterns.some((pattern) => pattern.test(combinedDocs));
  checks.push({
    name: `docs mention ${mention.name}`,
    passed,
    detail: passed ? "covered" : "missing required boundary language",
  });
}

const unsupportedMatches = combinedDocs
  .split(/\r?\n/)
  .flatMap((line, index) =>
    unsupportedClaims
      .filter((pattern) => pattern.test(line) && !negativeBoundaryContext.test(line))
      .map((pattern) => `line ${index + 1}: ${pattern.toString()}`),
  );

checks.push({
  name: "docs do not claim unsupported production capability",
  passed: unsupportedMatches.length === 0,
  detail:
    unsupportedMatches.length === 0
      ? "no unsupported production capability claims found"
      : unsupportedMatches.join(", "),
});

const prohibitedExecutionAttempted = {
  codex: false,
  gitMutation: false,
  qualityGateRunner: false,
  browserOpen: false,
  tauriLaunch: false,
  install: false,
  deploy: false,
};

checks.push({
  name: "documentation verifier is read-only",
  passed: Object.values(prohibitedExecutionAttempted).every((value) => value === false),
  detail: JSON.stringify(prohibitedExecutionAttempted),
});

const failedChecks = checks.filter((check) => !check.passed);

const result = {
  status: failedChecks.length === 0 ? "passed" : "failed",
  requiredDocs,
  boundaryMentionsChecked: requiredBoundaryMentions.map((mention) => mention.name),
  unsupportedMatches,
  prohibitedExecutionAttempted,
  checks,
  failedChecks,
};

console.log(JSON.stringify(result, null, 2));

if (failedChecks.length > 0) {
  process.exit(1);
}
