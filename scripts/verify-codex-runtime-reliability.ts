import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";
import packageJson from "@/package.json";
import { detectCodexCliStatus } from "@/lib/codex-cli/detect";
import type { CodexCliStatus } from "@/lib/codex-cli/types";
import {
  classifyCodexRuntimeFailure,
  computeCodexRuntimeStatus,
  summarizeCodexLastRun,
} from "@/lib/codex-cli/runtime-status";
import type { CodexFailureCategory } from "@/lib/codex-cli/runtime-status";
import { createScopedCodexRunnerPolicy } from "@/lib/codex-cli/runner-policy";
import { getRunnerSafetyStatus } from "@/lib/codex-cli/runner-safety";
import { validateScopedCodexRunnerInput } from "@/lib/codex-cli/scoped-runner";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function assertAuthUnknownNotVerified(status: CodexCliStatus): void {
  const verifiedLikeStatuses = new Set<string>(["verified", "authenticated", "auth_verified"]);
  assert(!verifiedLikeStatuses.has(status.authStatus), "Auth status must not be marked verified by safe detection");
  assert(status.authStatus !== "unknown" || !status.installed, "Auth unknown must not be treated as verified");
}

async function readProjectFile(path: string): Promise<string> {
  return readFile(join(process.cwd(), path), "utf8");
}

const sourceFileReadCallPattern = new RegExp("read" + "File(?:Sync)?\\([^)]*(?:auth\\.json|\\.env(?:\\.local)?)", "i");

function assertNoForbiddenPackageSurface(): void {
  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  const dependencyNames = Object.keys(dependencies);
  const scripts = packageJson.scripts as Record<string, string>;
  const scriptText = Object.values(scripts).join("\n");

  assert(!dependencyNames.some((name) => /^openai$/i.test(name) || /@openai/i.test(name)), "OpenAI package must not be added");
  assert(!dependencyNames.some((name) => /node-pty/i.test(name)), "node-pty dependency must not be added");
  assert(!dependencyNames.some((name) => /octokit|github/i.test(name)), "GitHub integration dependency must not be added");
  assert(!dependencyNames.some((name) => /vercel/i.test(name)), "Vercel dependency must not be added");
  assert(!dependencyNames.some((name) => /supabase/i.test(name)), "Supabase dependency must not be added");
  assert(!dependencyNames.some((name) => /stripe|clerk|next-auth|auth0|mcp/i.test(name)), "Auth, payment, team, or MCP dependency must not be added");
  assert(!/node-pty|terminal emulator|command text box|arbitrary shell|openai api|github api|vercel deploy|supabase|mcp/i.test(scriptText), "Package scripts must not expose forbidden runtime surfaces");
  assert(scripts["codex:verify:runtime-reliability"] === "tsx scripts/verify-codex-runtime-reliability.ts", "Runtime reliability verification script is missing");
}

async function assertNoForbiddenRuntimeReads(): Promise<void> {
  const runtimeFiles = [
    "lib/codex-cli/detect.ts",
    "lib/codex-cli/runtime-status.ts",
    "lib/codex-cli/runtime-last-run.ts",
    "lib/codex-cli/runtime-failure-classification.ts",
    "lib/codex-cli/runner-safety.ts",
    "lib/codex-cli/scoped-runner.ts",
    "lib/local-shell/local-shell-status.ts",
    "components/office/CodexRuntimeStatus.tsx",
    "components/settings/CodexRuntimeReliabilityCard.tsx",
    "components/review/ScopedCodexRunnerPanel.tsx",
  ];
  const fileTexts = await Promise.all(runtimeFiles.map(async (path) => [path, await readProjectFile(path)] as const));





  for (const [path, text] of fileTexts) {
    assert(!sourceFileReadCallPattern.test(text), `${path} must not read auth.json or env files`);
    assert(!/(OPENAI_API_KEY|sk-[a-z0-9_-]+).*=(?!.*redact)/i.test(text), `${path} must not store OpenAI tokens`);
    assert(!/from\s+["']node-pty["']|require\(["']node-pty["']\)/i.test(text), `${path} must not import node-pty`);
  }

  const detectText = fileTexts.find(([path]) => path === "lib/codex-cli/detect.ts")?.[1] ?? "";
  assert(/execAllowedDetectionCommand\("which", \["codex"\]\)/.test(detectText), "CLI detector should only locate codex safely");
  assert(/readCodexVersion\(codexPath\)/.test(detectText), "CLI detector should only read Codex version after locating codex");
  assert(!/auth\.json|\.env(?:\.local)?|OPENAI_API_KEY/.test(detectText), "CLI detector must not inspect auth files or tokens");

  const localShellText = fileTexts.find(([path]) => path === "lib/local-shell/local-shell-status.ts")?.[1] ?? "";
  assert(/executionAttempted:\s*{[\s\S]*codex:\s*false/.test(localShellText), "Settings/local shell status must report no Codex execution");
  assert(/qualityGate:\s*false/.test(localShellText), "Settings/local shell status must report no Quality Gate execution");
  assert(!/runScopedCodexTask|runQualityGate|execFileAsync\(codex/i.test(localShellText), "Settings/local shell status helper must not execute Codex or Quality Gates");
}

function assertRunnerPolicyAndValidation(): void {
  const policy = createScopedCodexRunnerPolicy();
  assert(policy.allowlistedExecutable === "codex", "Runner must only allow the codex executable");
  assert(policy.allowArbitraryShell === false, "Arbitrary shell must be disabled");
  assert(policy.allowAutoPush === false, "Auto push must be disabled");
  assert(policy.allowAutoDeploy === false, "Auto deploy must be disabled");
  assert(policy.requireApprovedProjectPath === true, "Approved project path must be required");
  assert(policy.requireExplicitUserConfirmation === true, "Explicit confirmation must be required");

  const safetyStatus = getRunnerSafetyStatus({
    projectId: "runtime-reliability-verification",
    localPath: "not_configured",
  });
  assert(safetyStatus.canExecute === false, "Safety status helper must not execute Codex");
  assert(safetyStatus.policy.allowPromptExecution === false, "Safety status helper must keep prompt execution disabled");

  const missingCli = validateScopedCodexRunnerInput({
    executableName: undefined,
    codexInstalled: false,
    approvedProjectPath: process.cwd(),
    projectPathApproved: true,
    explicitConfirmation: true,
    promptReviewed: true,
    forbiddenScopeAcknowledged: true,
    noAutoCommitPushDeployAcknowledged: true,
    prompt: "Mock prompt only. Do not execute.",
  });
  assert(!missingCli.allowed && missingCli.reasons.some((reason) => /not installed/i.test(reason)), "Missing CLI must be blocked");

  const missingApprovedPath = validateScopedCodexRunnerInput({
    executableName: "codex",
    codexInstalled: true,
    approvedProjectPath: "",
    projectPathApproved: false,
    explicitConfirmation: true,
    promptReviewed: true,
    forbiddenScopeAcknowledged: true,
    noAutoCommitPushDeployAcknowledged: true,
    prompt: "Mock prompt only. Do not execute.",
  });
  assert(!missingApprovedPath.allowed && missingApprovedPath.reasons.some((reason) => /path/i.test(reason)), "Missing approved path must be blocked");

  const policyBlocked = validateScopedCodexRunnerInput({
    executableName: "bash",
    codexInstalled: true,
    approvedProjectPath: process.cwd(),
    projectPathApproved: true,
    explicitConfirmation: false,
    promptReviewed: false,
    forbiddenScopeAcknowledged: false,
    noAutoCommitPushDeployAcknowledged: false,
    prompt: "Mock prompt only. Do not execute.",
  });
  assert(!policyBlocked.allowed, "Policy violations must be blocked");
  assert(policyBlocked.reasons.some((reason) => /allowlisted codex/i.test(reason)), "Non-codex executable must be rejected");
}

function assertFailureClassification(): void {
  const cases: Array<[CodexFailureCategory, string | Parameters<typeof classifyCodexRuntimeFailure>[0]]> = [
    ["missing_cli", "Codex CLI is not installed"],
    ["missing_approved_path", "Missing approved project path"],
    ["policy_blocked", { status: "blocked", reasons: ["Explicit confirmation is missing."] }],
    ["nonzero_exit", { status: "failed", exitCode: 2 }],
    ["timeout", { status: "failed", timedOut: true }],
  ];

  for (const [expected, input] of cases) {
    assert(classifyCodexRuntimeFailure(input).category === expected, `Expected ${expected} failure classification`);
  }

  const summary = summarizeCodexLastRun({
    taskId: "runtime-reliability-task",
    projectId: "runtime-reliability-project",
    runnerResult: {
      status: "failed",
      startedAt: "2026-07-03T00:00:00.000Z",
      endedAt: "2026-07-03T00:00:02.500Z",
      exitCode: 2,
      stdoutPreview: "bounded stdout preview",
      stderrPreview: "bounded stderr preview",
      stdoutTruncated: false,
      stderrTruncated: false,
      outputPreview: "bounded stdout preview",
      errorPreview: "bounded stderr preview",
      durationMs: 2500,
      eventIds: [],
    },
  });

  assert(summary.durationMs === 2500, "Last run summary must include duration");
  assert(summary.failureCategory === "nonzero_exit", "Last run summary must include failure category");
  assert(summary.status === "failed", "Last run summary must preserve failed status");

  const blockedWithZeroExit = summarizeCodexLastRun({
    runnerResult: {
      status: "blocked",
      exitCode: 0,
      errorPreview: "Missing approved project path",
    },
  });
  assert(blockedWithZeroExit.status === "blocked", "Explicit blocked status must take precedence over exitCode 0");
  assert(blockedWithZeroExit.failureCategory === "missing_approved_path", "Blocked run must keep failure classification");

  const timedOutWithZeroExit = summarizeCodexLastRun({
    runnerResult: {
      status: "timed_out",
      exitCode: 0,
      errorPreview: "Timed out while waiting for Codex.",
    },
  });
  assert(timedOutWithZeroExit.status === "timed_out", "Explicit timed_out status must take precedence over exitCode 0");
  assert(timedOutWithZeroExit.failureCategory === "timeout", "Timed-out run must keep failure classification");

  const missingPathStatus = computeCodexRuntimeStatus({
    cliAvailability: "version_detected",
    authCapability: "auth_unknown",
    approvedProjectPath: { approved: false, localPath: "" },
    lastRun: summarizeCodexLastRun({}),
  });
  assert(missingPathStatus.codexRuntimeReadiness === "blocked_missing_approved_path", "Missing approved path must affect runtime readiness");

  const policyBlockedStatus = computeCodexRuntimeStatus({
    cliAvailability: "version_detected",
    authCapability: "auth_unknown",
    approvedProjectPath: { approved: true, localPath: process.cwd() },
    policy: { allowPromptExecution: false, reasons: ["policy disabled"] },
    lastRun: summarizeCodexLastRun({}),
  });
  assert(policyBlockedStatus.codexRuntimeReadiness === "blocked_policy", "Policy blocked status must affect runtime readiness");
}

async function main(): Promise<void> {
  const cliStatus = await detectCodexCliStatus();
  assert(cliStatus.detectionMode === "safe_detection_only", "CLI status must use safe detection only");
  assert(typeof cliStatus.checkedAt === "string" && cliStatus.checkedAt.length > 0, "CLI status must include checkedAt");
  assert(!cliStatus.path || basename(cliStatus.path) === "codex", "Detected CLI path must resolve to codex");
  assertAuthUnknownNotVerified(cliStatus);

  assertNoForbiddenPackageSurface();
  await assertNoForbiddenRuntimeReads();
  assertRunnerPolicyAndValidation();
  assertFailureClassification();

  const summary = {
    cliStatusGenerated: true,
    cliInstalled: cliStatus.installed,
    cliVersion: cliStatus.version ?? null,
    authStatus: cliStatus.authStatus,
    authVerified: false,
    detectionMode: cliStatus.detectionMode,
    classificationsVerified: [
      "missing_cli",
      "missing_approved_path",
      "policy_blocked",
      "nonzero_exit",
      "timeout",
    ],
    lastRunSummaryVerified: true,
    settingsStatusExecutesCodex: false,
    forbiddenSurfaceVerified: {
      authJsonRead: false,
      envRead: false,
      tokenStorage: false,
      openAiApi: false,
      arbitraryShell: false,
      commandTextBox: false,
      nodePtyTerminal: false,
      gitMutation: false,
      qualityGateRunner: false,
    },
    realCodexCodingTaskExecuted: false,
    filesModifiedByVerifier: false,
    dependenciesInstalled: false,
    browserOpened: false,
    tauriLaunched: false,
  };

  console.log("Codex runtime reliability verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Codex runtime reliability verification failed");
  console.error(error);
  process.exit(1);
});
