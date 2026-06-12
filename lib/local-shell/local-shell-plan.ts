export const localShellLaunchMethods = [
  "npm run dev",
  "npm run local:shell:status",
  "npm run local:shell:verify",
] as const;

export const localShellFutureEvaluation = [
  "Tauri evaluation",
  "desktop package feasibility",
  "local launcher script",
  "app icon / dock behavior",
  "offline mode hardening",
] as const;

export const localShellExplicitNonGoals = [
  "desktop packaging",
  "auto update",
  "background daemon",
  "cron",
  "startup service",
  "cloud sync",
  "GitHub API integration",
  "Vercel integration",
  "Supabase integration",
  "auth",
  "payment",
  "MCP server",
] as const;
