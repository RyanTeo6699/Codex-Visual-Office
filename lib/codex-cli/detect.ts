import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { CodexCliStatus } from "./types";

const execFileAsync = promisify(execFile);
const detectionTimeoutMs = 3000;

async function execAllowedDetectionCommand(command: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync(command, args, {
    shell: false,
    timeout: detectionTimeoutMs,
    windowsHide: true,
  });

  return stdout.trim();
}

async function locateCodexBinary(): Promise<string | undefined> {
  const result = await execAllowedDetectionCommand("which", ["codex"]);
  return result.split("\n").map((line) => line.trim()).find(Boolean);
}

async function readCodexVersion(codexPath: string): Promise<string | undefined> {
  const result = await execAllowedDetectionCommand(codexPath, ["--version"]);
  return result.split("\n").map((line) => line.trim()).find(Boolean);
}

export async function detectCodexCliStatus(): Promise<CodexCliStatus> {
  const checkedAt = new Date().toISOString();
  const errors: string[] = [];

  let codexPath: string | undefined;
  try {
    codexPath = await locateCodexBinary();
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Codex CLI lookup failed.");
  }

  if (!codexPath) {
    return {
      installed: false,
      authStatus: "cli_unavailable",
      detectionMode: "safe_detection_only",
      checkedAt,
      errors: errors.length ? errors : undefined,
    };
  }

  let version: string | undefined;
  try {
    version = await readCodexVersion(codexPath);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Codex CLI version check failed.");
  }

  return {
    installed: true,
    path: codexPath,
    version,
    authStatus: "cli_available_auth_not_verified",
    detectionMode: "safe_detection_only",
    checkedAt,
    errors: errors.length ? errors : undefined,
  };
}
