import { detectCodexCliStatus } from "@/lib/codex-cli/detect";

async function main(): Promise<void> {
  const status = await detectCodexCliStatus();

  const summary = {
    installed: status.installed,
    path: status.path ?? null,
    version: status.version ?? null,
    authStatus: status.authStatus,
    detectionMode: status.detectionMode,
    checkedAt: status.checkedAt,
    taskExecutionAttempted: false,
    errors: status.errors ?? [],
  };

  console.log("Codex CLI safe detection verification passed");
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error: unknown) => {
  console.error("Codex CLI safe detection verification failed");
  console.error(error);
  process.exit(1);
});
