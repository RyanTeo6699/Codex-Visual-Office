import { buildLocalLauncherReport, maybeOpenBrowser, parseLocalLauncherArgs } from "@/lib/local-launcher/local-launcher-status";

async function main(): Promise<void> {
  const options = parseLocalLauncherArgs(process.argv.slice(2));
  const launchMode = options.open ? "open_browser" : "status_only";
  const report = await buildLocalLauncherReport({
    mode: launchMode,
    checkUrl: options.checkUrl,
  });
  const openResult = await maybeOpenBrowser({
    appUrl: report.appUrl,
    mode: launchMode,
  });

  if (options.json) {
    console.log(JSON.stringify({ ...report, browserOpenAttempted: openResult.attempted }, null, 2));
    return;
  }

  console.log("Codex Visual Office local launcher");
  console.log(JSON.stringify({ ...report, browserOpenAttempted: openResult.attempted }, null, 2));
}

main().catch((error: unknown) => {
  console.error("Local launcher failed");
  console.error(error);
  process.exit(1);
});
