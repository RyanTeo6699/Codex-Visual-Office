import fs from "node:fs";
import os from "node:os";
import path from "node:path";

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type WorkflowPayload = {
  lifecycleEvent?: string;
  promptVersion?: string;
  status?: string;
  exitCode?: number;
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  cliTaskExecutionAttempted?: boolean;
  gitMutationAttempted?: boolean;
  qualityGateExecutionAttempted?: boolean;
  arbitraryShellAllowed?: boolean;
  sourceReadAttempted?: boolean;
  authTokenReadAttempted?: boolean;
};

const projectRoot = process.cwd();
const providerProjectId = "provider-workspace";
const providerTaskId = "task-provider-review";
const approvedPath = projectRoot;

const workflowSurfaceFiles = [
  "app/page.tsx",
  "app/projects/[id]/page.tsx",
  "app/review/[taskId]/page.tsx",
  "app/review/[taskId]/actions.ts",
  "app/settings/page.tsx",
  "components/office/AgentSeat.tsx",
  "components/office/AgentWorkflowStatus.tsx",
  "components/office/BuildWall.tsx",
  "components/office/CodexRuntimeStatus.tsx",
  "components/office/EventTicker.tsx",
  "components/office/OfficeMap.tsx",
  "components/office/ProjectRoomCard.tsx",
  "components/office/ProjectWorkflowSummary.tsx",
  "components/review/CodexPromptHandoff.tsx",
  "components/review/QualityGateResultsPanel.tsx",
  "components/review/ReviewPanel.tsx",
  "components/review/ReviewReadinessSummary.tsx",
  "components/review/ScopedCodexRunnerPanel.tsx",
  "components/review/WorkflowInsightPanels.tsx",
  "components/settings/CodexRuntimeReliabilityCard.tsx",
  "components/settings/SettingsPanel.tsx",
  "lib/agents/agent-seat-state.ts",
  "lib/agents/agent-workflow-summary.ts",
  "lib/agents/agent-workflow-types.ts",
  "lib/projects/project-health-summary.ts",
  "lib/projects/project-workspace-summary.ts",
  "lib/codex-cli/runtime-status.ts",
  "lib/codex-cli/runtime-last-run.ts",
  "lib/codex-cli/runtime-failure-classification.ts",
  "lib/workflow/codex-run-history.ts",
  "lib/workflow/prompt-version-summary.ts",
  "lib/workflow/task-lifecycle-summary.ts",
  "lib/workflow/task-lifecycle-types.ts",
  "lib/workflow/workflow-next-action.ts",
  "lib/workflow/workflow-timeline.ts",
];

const forbiddenDependencyPatterns = [
  /^openai$/i,
  /^@openai\//i,
  /^node-pty$/i,
  /^@supabase\//i,
  /^supabase$/i,
  /^firebase$/i,
  /^@octokit\//i,
  /^@vercel\//i,
  /^vercel$/i,
  /^next-auth$/i,
  /^@auth\//i,
  /^stripe$/i,
  /^@stripe\//i,
  /^@modelcontextprotocol\//i,
];

const forbiddenScriptPatterns = [
  /\bopenai\b/i,
  /\bnode-pty\b/i,
  /\bcloud\s*sync\b/i,
  /\bteam\s*workspace\b/i,
  /\bmcp\b/i,
  /\bstripe\b|\bpayment\b|\bbilling\b/i,
  /\bnext-auth\b|\boauth\b|\blogin\b|\bauth0\b|\bclerk\b/i,
  /\bgithub:(?!verify)|\bvercel\b|\bsupabase\b/i,
];

const forbiddenControlPatterns = [
  /\brun automatically\b/i,
  /\bauto codex\b/i,
  /\bauto fix\b/i,
  /\bauto[-\s]?run\b/i,
  /\bautomatic\s+(codex|git|quality|repair|fix|execution|runner)\b/i,
  /\bterminal\s+(emulator|runner|console|panel|input)\b/i,
  /\bcommand\s+(input|text box|textbox|entry|runner)\b/i,
  /\btoken\s+(input|field|entry|textbox|text box)\b/i,
  /\bcloud sync\b/i,
  /\bteam workspace\b/i,
  /\b(?:github|vercel|supabase)\s+connect\b/i,
  /\bconnect\s+(?:github|vercel|supabase)\b/i,
];

const forbiddenWorkflowExecutionPatterns = [
  /useEffect[\s\S]{0,500}\b(runScopedCodexTaskAction|runEnabledQualityGatesAction|runScopedCodexTask|runEnabledQualityGates)\b/i,
  /set(?:Timeout|Interval)[\s\S]{0,500}\b(runScopedCodexTaskAction|runEnabledQualityGatesAction|runScopedCodexTask|runEnabledQualityGates)\b/i,
  /\b(autoCommit|autoPush|autoDeploy|autoFix|autoRun|autoCodex)\b/i,
];

const forbiddenReadPatterns = [
  /readFile(?:Sync)?\([^)]*(?:auth\.json|\.env(?:\.local)?|token|secret|password)/i,
  /\bprocess\.env\.(?:OPENAI_API_KEY|API_KEY|TOKEN|SECRET|PASSWORD)\b/i,
  /\bOPENAI_API_KEY\s*=/i,
  /\bsk-[a-z0-9_-]{12,}\b/i,
];

const boundaryPattern = /\b(no|not|without|never|disabled|absent|forbidden|blocked|preview only|dry-run only|dry run only|check only|static|display only|not connected|not implemented|not triggered|not installed|unavailable|must not)\b/i;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readOwnedText(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function readPackageJson(): PackageShape {
  return JSON.parse(readOwnedText("package.json")) as PackageShape;
}

function dependencyNames(packageJson: PackageShape): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function isPatternDeclaration(line: string): boolean {
  const trimmed = line.trim();
  return trimmed.startsWith("/") || trimmed.startsWith("const forbidden") || trimmed.startsWith("const boundaryPattern");
}

function lineMatches(text: string, patterns: RegExp[], options: { allowBoundary: boolean }): string[] {
  const matches: string[] = [];

  text.split(/\r?\n/).forEach((line, index) => {
    if (isPatternDeclaration(line)) {
      return;
    }

    if (patterns.some((pattern) => pattern.test(line)) && !(options.allowBoundary && boundaryPattern.test(line))) {
      matches.push(`${index + 1}: ${line.trim()}`);
    }
  });

  return matches;
}

function scanWorkflowSurfaces(): void {
  const packageJson = readPackageJson();
  const deps = dependencyNames(packageJson);
  const forbiddenDeps = deps.filter((name) => forbiddenDependencyPatterns.some((pattern) => pattern.test(name)));
  assert(forbiddenDeps.length === 0, `Forbidden agent workflow dependencies found: ${forbiddenDeps.join(", ")}`);

  const scriptText = Object.entries(packageJson.scripts ?? {})
    .map(([name, command]) => `${name} ${command}`)
    .join("\n");
  const forbiddenScripts = lineMatches(scriptText, forbiddenScriptPatterns, { allowBoundary: false });
  assert(forbiddenScripts.length === 0, `Forbidden cloud/auth/payment/team/MCP/OpenAI package scripts found: ${forbiddenScripts.join("; ")}`);

  const missingFiles = workflowSurfaceFiles.filter((file) => !fs.existsSync(path.join(projectRoot, file)));
  assert(missingFiles.length === 0, `Workflow surface files missing: ${missingFiles.join(", ")}`);

  const scannedText = workflowSurfaceFiles
    .map((file) => `\n--- ${file} ---\n${readOwnedText(file)}`)
    .join("\n");
  const forbiddenControls = lineMatches(scannedText, forbiddenControlPatterns, { allowBoundary: true });
  assert(forbiddenControls.length === 0, `Forbidden Phase 11 workflow controls found: ${forbiddenControls.join("; ")}`);

  const forbiddenAutoExecution = lineMatches(scannedText, forbiddenWorkflowExecutionPatterns, { allowBoundary: true });
  assert(forbiddenAutoExecution.length === 0, `Automatic Codex/Git/Quality workflow execution found: ${forbiddenAutoExecution.join("; ")}`);

  const forbiddenReads = lineMatches(scannedText, forbiddenReadPatterns, { allowBoundary: true });
  assert(forbiddenReads.length === 0, `Forbidden source/env/auth/token reads found: ${forbiddenReads.join("; ")}`);
}

function parsePayload(payload: unknown): WorkflowPayload {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  return payload as WorkflowPayload;
}

async function main(): Promise<void> {
  scanWorkflowSurfaces();

  const tempDbDir = fs.mkdtempSync(path.join(os.tmpdir(), "cvo-agent-workflow-"));
  process.env.CVO_LOCAL_DB_PATH = path.join(tempDbDir, "codex-visual-office-agent-workflow.sqlite");

  const { initializeLocalDb } = await import("@/lib/local-db/init");
  const { seedFromMockData } = await import("@/lib/local-db/seed/seed-from-mock-data");
  const { sqliteClient } = await import("@/lib/local-db/client");
  const { addTaskEvent } = await import("@/lib/local-db/operations/events");
  const { createTask, updateAgentSeatWorkState } = await import("@/lib/local-db/operations/tasks");
  const { upsertApprovedProjectPath } = await import("@/lib/local-db/operations/approved-project-paths");
  const { listQualityGateConfigsForProject } = await import("@/lib/local-db/operations/quality-gate-configs");
  const { createQualityGateRun, updateQualityGateRunStatus } = await import("@/lib/local-db/operations/quality-gate-runs");
  const {
    getAgentWorkflowSummaryForProject,
    getAgentWorkflowSummaryForTask,
    getAllProjectWorkspaceSummaries,
    getProjectHealthSummaryForProject,
    getTaskLifecycleSummary,
    getWorkflowTimelineForTask,
    readSelectedProjectRoom,
    readSelectedReviewRoom,
  } = await import("@/lib/local-db/selected-reads");
  const { computeCodexRuntimeStatus, summarizeCodexLastRun } = await import("@/lib/codex-cli/runtime-status");
  const { classifyCodexRuntimeFailure } = await import("@/lib/codex-cli/runtime-failure-classification");
  const { summarizePromptVersions } = await import("@/lib/workflow/prompt-version-summary");
  const { summarizeCodexRunHistory } = await import("@/lib/workflow/codex-run-history");

  initializeLocalDb();
  seedFromMockData();

  try {
    const missingPathHealth = await getProjectHealthSummaryForProject(providerProjectId);
    assert(missingPathHealth, "Provider project health summary should exist after seed");
    assert(missingPathHealth.codexRuntime.readiness === "blocked_missing_approved_path", "Missing approved path should block Codex runtime readiness");
    assert(missingPathHealth.codexRuntime.failureCategory === "missing_approved_path", "Missing approved path should be classified");
    assert(missingPathHealth.recommendedNextAction === "configure_approved_path", "Missing approved path should recommend configuration");

    await upsertApprovedProjectPath({
      id: "verify-agent-workflow-approved-path",
      projectId: providerProjectId,
      localPath: approvedPath,
      label: "Agent workflow verification path",
      approved: true,
      note: "Temp verifier path; no source scan is performed.",
    });

    await updateAgentSeatWorkState("seat-2", {
      status: "waiting_review",
      currentTaskId: providerTaskId,
      currentProjectId: providerProjectId,
      focus: "Reviewing persisted agent workflow timeline",
    });

    await createTask({
      id: "verify-agent-workflow-blocked-task",
      projectId: providerProjectId,
      title: "Blocked verification-only workflow task",
      summary: "Temp DB task used to verify blocked lifecycle summaries.",
      status: "blocked",
      priority: "high",
      assignedSeatId: "seat-2",
      acceptanceCriteria: ["Blocked lifecycle state appears in summaries"],
      forbiddenScope: ["Automatic Codex execution", "Cloud sync"],
      changedFiles: ["scripts/verify-agent-workflow.ts"],
    });

    await addTaskEvent({
      id: "verify-agent-workflow-prompt-v1",
      projectId: providerProjectId,
      taskId: providerTaskId,
      seatId: "seat-2",
      type: "info",
      message: "Prompt v1 prepared for manual review",
      payload: {
        lifecycleEvent: "prompt_prepared",
        promptVersion: "v1",
        cliTaskExecutionAttempted: false,
        gitMutationAttempted: false,
        qualityGateExecutionAttempted: false,
        arbitraryShellAllowed: false,
        sourceReadAttempted: false,
        authTokenReadAttempted: false,
      },
    });

    await addTaskEvent({
      id: "verify-agent-workflow-prompt-v2",
      projectId: providerProjectId,
      taskId: providerTaskId,
      seatId: "seat-2",
      type: "info",
      message: "Prompt v2 superseded v1 after manual review",
      payload: {
        lifecycleEvent: "prompt_prepared",
        promptVersion: "v2",
        cliTaskExecutionAttempted: false,
        gitMutationAttempted: false,
        qualityGateExecutionAttempted: false,
        arbitraryShellAllowed: false,
        sourceReadAttempted: false,
        authTokenReadAttempted: false,
      },
    });

    await addTaskEvent({
      id: "verify-agent-workflow-run-requested",
      projectId: providerProjectId,
      taskId: providerTaskId,
      seatId: "seat-2",
      type: "info",
      message: "Scoped Codex run was requested in verifier history only",
      payload: {
        lifecycleEvent: "runner_requested",
        status: "running",
        promptVersion: "v2",
        cliTaskExecutionAttempted: false,
        gitMutationAttempted: false,
        qualityGateExecutionAttempted: false,
        arbitraryShellAllowed: false,
        sourceReadAttempted: false,
        authTokenReadAttempted: false,
      },
    });

    await addTaskEvent({
      id: "verify-agent-workflow-run-completed",
      projectId: providerProjectId,
      taskId: providerTaskId,
      seatId: "seat-2",
      type: "success",
      message: "Scoped Codex run history recorded as succeeded without execution",
      payload: {
        lifecycleEvent: "runner_completed",
        status: "completed",
        exitCode: 0,
        startedAt: "2026-06-01T00:00:00.000Z",
        endedAt: "2026-06-01T00:00:01.000Z",
        durationMs: 1000,
        promptVersion: "v2",
        cliTaskExecutionAttempted: false,
        gitMutationAttempted: false,
        qualityGateExecutionAttempted: false,
        arbitraryShellAllowed: false,
        sourceReadAttempted: false,
        authTokenReadAttempted: false,
      },
    });

    const configs = await listQualityGateConfigsForProject(providerProjectId);
    const buildConfig = configs.find((config) => config.commandKey === "npm_build") ?? configs[0];
    assert(buildConfig, "Quality gate config should be seeded");
    const failedQualityRun = await createQualityGateRun({
      id: "verify-agent-workflow-failed-quality-run",
      taskId: providerTaskId,
      projectId: providerProjectId,
      configId: buildConfig.id,
      commandKey: buildConfig.commandKey,
      command: buildConfig.command,
      status: "pending",
      createdAt: "2026-06-01T00:01:00.000Z",
    });
    await updateQualityGateRunStatus(failedQualityRun.id, {
      status: "failed",
      exitCode: 1,
      durationMs: 1200,
      stdoutPreview: "Mock quality run record only",
      stderrPreview: "Mock failure for recommended next action verification",
      startedAt: "2026-06-01T00:01:00.000Z",
      endedAt: "2026-06-01T00:01:01.200Z",
      failedReason: "Mock failed quality record",
    });

    const [
      projectRoom,
      reviewRoom,
      providerHealth,
      workspaceSummaries,
      agentProjectSummary,
      agentTaskSummary,
      taskLifecycleSummary,
      workflowTimeline,
    ] = await Promise.all([
      readSelectedProjectRoom(providerProjectId),
      readSelectedReviewRoom(providerTaskId),
      getProjectHealthSummaryForProject(providerProjectId),
      getAllProjectWorkspaceSummaries(),
      getAgentWorkflowSummaryForProject(providerProjectId),
      getAgentWorkflowSummaryForTask(providerTaskId),
      getTaskLifecycleSummary(providerTaskId),
      getWorkflowTimelineForTask(providerTaskId),
    ]);

    assert(projectRoom, "Project room read should exist");
    assert(reviewRoom, "Review room read should exist");
    assert(providerHealth, "Provider health summary should exist");
    assert(agentProjectSummary, "Agent project workflow summary should exist");
    assert(agentTaskSummary, "Agent task workflow summary should exist");
    assert(taskLifecycleSummary, "Task lifecycle summary should exist");
    assert(workflowTimeline, "Workflow timeline should exist");

    const reviewAgent = projectRoom.agentSeats.find((seat) => seat.id === "seat-2");
    assert(reviewAgent?.status === "waiting_review", "Agent visual state should show waiting_review");
    assert(reviewAgent.taskId === providerTaskId, "Agent visual state should point at the current task");
    assert(projectRoom.tasks.some((task) => task.status === "waiting_review"), "Task lifecycle summary should include waiting_review");
    assert(projectRoom.tasks.some((task) => task.status === "blocked"), "Task lifecycle summary should include blocked");

    const taskSummary = providerHealth.tasks;
    assert(taskSummary.total >= 1, "Task lifecycle summary should include provider tasks");
    assert(taskSummary.review >= 1, "Task lifecycle summary should count review tasks");
    assert(taskSummary.blocked >= 1, "Task lifecycle summary should count blocked tasks");
    assert(taskLifecycleSummary.lifecycleStage === "reviewing", "Task lifecycle implementation should classify the provider task as reviewing");
    assert(taskLifecycleSummary.phase === "waiting_for_review", "Task lifecycle implementation should expose compatible v2 phase alias");
    assert(taskLifecycleSummary.currentTaskStatus === "waiting_review", "Task lifecycle implementation should expose currentTaskStatus");
    assert(taskLifecycleSummary.qualityGateSummaryStatus === "failed", "Task lifecycle implementation should expose qualityGateSummaryStatus");
    assert(taskLifecycleSummary.failedQualityGateCount >= 1, "Task lifecycle implementation should count failed quality gates");
    assert(taskLifecycleSummary.recommendedNextAction === "run_quality_gates", "Task lifecycle implementation should recommend quality gate review");
    assert(taskLifecycleSummary.timelineEvents >= 1, "Task lifecycle implementation should expose timeline event count");
    assert(Array.isArray(taskLifecycleSummary.warnings), "Task lifecycle implementation should expose warnings");

    const promptSummary = summarizePromptVersions({
      taskId: providerTaskId,
      projectId: providerProjectId,
      taskEvents: reviewRoom.taskEvents,
    });
    assert(promptSummary.items.some((item) => item.promptVersion === "v1"), "Prompt version summary should include v1");
    assert(promptSummary.items.some((item) => item.promptVersion === "v2"), "Prompt version summary should include v2");
    assert(promptSummary.latestVersion === "v2", "Prompt version summary should identify v2 as latest");
    assert(promptSummary.promptVersionCount === 2, "Prompt version summary should expose promptVersionCount");
    assert(promptSummary.promptState === "runner_requested", "Prompt version summary should expose latest promptState");
    assert(promptSummary.sourceEvents.length >= 2, "Prompt version summary should expose sourceEvents");

    assert(workflowTimeline.items.some((item) => item.status === "prompt_prepared"), "Workflow timeline should include prompt preparation");
    assert(workflowTimeline.items.some((item) => item.status === "runner_requested"), "Workflow timeline should include runner request");
    assert(workflowTimeline.items.some((item) => item.status === "runner_completed"), "Workflow timeline should include runner completion");
    assert(workflowTimeline.items.some((item) => item.kind === "quality_gate_run" && item.status === "failed"), "Workflow timeline should include failed quality record");

    const codexRunHistory = summarizeCodexRunHistory({
      taskId: providerTaskId,
      projectId: providerProjectId,
      taskEvents: reviewRoom.taskEvents,
    });
    assert(codexRunHistory.runEventCount >= 2, "Codex run history should include runner events");
    assert(codexRunHistory.totalRuns >= 2, "Codex run history should expose totalRuns");
    assert(codexRunHistory.successfulRuns >= 1, "Codex run history should expose successfulRuns");
    assert(codexRunHistory.latestRunStatus === "succeeded", "Codex run history should expose latestRunStatus");
    assert(codexRunHistory.items.some((event) => event.lifecycleEvent === "runner_completed"), "Codex run history should include completion");
    assert(!codexRunHistory.items.some((event) => event.lifecycleEvent === "prompt_prepared"), "Codex run history should exclude non-run prompt events");

    const lastRunFromEvents = summarizeCodexLastRun({ events: reviewRoom.taskEvents, taskId: providerTaskId, projectId: providerProjectId });
    assert(lastRunFromEvents.status === "succeeded", "Codex run history should summarize runner_completed as succeeded");
    assert(codexRunHistory.lastRun.status === "succeeded", "Codex run history implementation should summarize runner_completed as succeeded");
    assert(agentProjectSummary.waitingReviewSeatCount >= 1, "Agent project summary should count review seats");
    assert(agentTaskSummary.seats.some((seat) => seat.seatId === "seat-2" && seat.activity === "reviewing"), "Agent task summary should show seat-2 reviewing");
    assert(agentTaskSummary.seats.some((seat) => seat.seatId === "seat-2" && seat.state === "reviewing"), "Agent task summary should expose v2 seat state");
    assert(agentTaskSummary.seats.some((seat) => seat.seatId === "seat-2" && seat.manualNextAction), "Agent task summary should expose manual next action");
    assert(agentTaskSummary.seats.some((seat) => seat.seatId === "seat-2" && seat.safetyBoundary.includes("No automatic")), "Agent task summary should expose safety boundary");

    const classifications = {
      failed: summarizeCodexLastRun({ runnerResult: { status: "failed", exitCode: 1, stderrPreview: "nonzero failure" } }).status,
      blocked: summarizeCodexLastRun({ runnerResult: { status: "blocked", errorPreview: "policy blocked" } }).status,
      timedOut: summarizeCodexLastRun({ runnerResult: { status: "timed_out", errorPreview: "timeout" } }).status,
      succeeded: summarizeCodexLastRun({ runnerResult: { status: "completed", exitCode: 0, stdoutPreview: "ok" } }).status,
      authUnknown: computeCodexRuntimeStatus({
        cliStatus: {
          installed: true,
          path: "/usr/local/bin/codex",
          version: "verify",
          authStatus: "cli_available_auth_not_verified",
          detectionMode: "safe_detection_only",
          checkedAt: "2026-06-01T00:00:00.000Z",
        },
        approvedProjectPath: { approved: true, localPath: approvedPath },
        policy: { requireApprovedProjectPath: true, allowPromptExecution: true },
      }).codexAuthCapability,
      missingApprovedPath: classifyCodexRuntimeFailure("missing approved project path").category,
    };
    assert(classifications.failed === "failed", "failed classification should be verified");
    assert(classifications.blocked === "blocked", "blocked classification should be verified");
    assert(classifications.timedOut === "timed_out", "timed_out classification should be verified");
    assert(classifications.succeeded === "succeeded", "succeeded classification should be verified");
    assert(classifications.authUnknown === "auth_unknown", "auth_unknown classification should be verified");
    assert(classifications.missingApprovedPath === "missing_approved_path", "missing_approved_path classification should be verified");

    assert(providerHealth.quality.latestRunStatus === "failed", "Failed quality run record should be reflected");
    assert(providerHealth.recommendedNextAction === "run_quality_gates", "Failed quality record should recommend running quality gates");
    assert(workspaceSummaries.some((summary) => summary.projectId === providerProjectId && summary.recommendedNextAction === "run_quality_gates"), "Workspace summary should include recommended next action");

    const unsafePayloads = reviewRoom.taskEvents
      .map((event) => parsePayload(event.payload))
      .filter((payload) =>
        payload.cliTaskExecutionAttempted === true ||
        payload.gitMutationAttempted === true ||
        payload.qualityGateExecutionAttempted === true ||
        payload.arbitraryShellAllowed === true ||
        payload.sourceReadAttempted === true ||
        payload.authTokenReadAttempted === true,
      );
    assert(unsafePayloads.length === 0, "Workflow verifier must not record forbidden execution/read attempts");

    const summary = {
      tempDbPath: process.env.CVO_LOCAL_DB_PATH,
      seededMockData: true,
      agentVisualState: {
        seatId: reviewAgent.id,
        status: reviewAgent.status,
        taskId: reviewAgent.taskId,
      },
      taskLifecycleSummary: taskSummary,
      taskLifecycleDetail: {
        lifecycleStage: taskLifecycleSummary.lifecycleStage,
        failedQualityGateCount: taskLifecycleSummary.failedQualityGateCount,
        recommendedNextAction: taskLifecycleSummary.recommendedNextAction,
      },
      promptVersionSummary: promptSummary,
      codexRunHistory: {
        runEventCount: codexRunHistory.runEventCount,
        lastRun: codexRunHistory.lastRun.status,
        items: codexRunHistory.items,
      },
      workflowTimeline: {
        itemCount: workflowTimeline.items.length,
        statuses: workflowTimeline.items.map((item) => item.status).filter(Boolean),
        hasBlockingItem: workflowTimeline.hasBlockingItem,
      },
      agentWorkflowSummary: {
        projectWaitingReviewSeatCount: agentProjectSummary.waitingReviewSeatCount,
        taskSeatCount: agentTaskSummary.seats.length,
      },
      recommendedNextAction: providerHealth.recommendedNextAction,
      classifications,
      automaticCodexExecutionAttempted: false,
      automaticGitExecutionAttempted: false,
      automaticQualityExecutionAttempted: false,
      sourceEnvAuthTokenReadAttempted: false,
      openAiApiAttempted: false,
      arbitraryShellAttempted: false,
      commandTextBoxAdded: false,
      terminalNodePtyAdded: false,
      cloudAuthPaymentTeamMcpAdded: false,
      browserLaunched: false,
      tauriLaunched: false,
      installAttempted: false,
      deployAttempted: false,
    };

    console.log("Agent workflow verification passed");
    console.log(JSON.stringify(summary, null, 2));
  } finally {
    sqliteClient.close();
    fs.rmSync(tempDbDir, { force: true, recursive: true });
  }
}

main().catch((error: unknown) => {
  console.error("Agent workflow verification failed");
  console.error(error);
  process.exit(1);
});
