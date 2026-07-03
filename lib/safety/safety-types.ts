export type OverallSafetyStatus = "safe_local_only" | "needs_review" | "blocked" | "unknown";

export type PermissionState = "allowed" | "blocked" | "requires_approval" | "disabled" | "unknown";

export type SafetyCapability =
  | "approved_project_paths"
  | "scoped_codex_runner"
  | "local_sqlite_backup"
  | "restore_dry_run"
  | "archive_dry_run"
  | "localhost_status"
  | "tauri_prototype_core"
  | "cloud_sync"
  | "credential_access"
  | "arbitrary_shell"
  | "terminal_access"
  | "node_pty"
  | "auto_git_mutation"
  | "auto_deploy"
  | "dev_server_start"
  | "production_installer"
  | "updater"
  | "shell_plugin"
  | "expanded_filesystem_access";

export interface PermissionSummary {
  state: PermissionState;
  summary: string;
}

export interface LocalPermissionModel {
  approvedPathPermission: PermissionSummary & {
    configured: boolean;
    approved: boolean;
    manualOnly: boolean;
    noAutoScan: boolean;
    noSourceRead: boolean;
  };
  runnerPermission: PermissionSummary & {
    scopedRunnerOnly: boolean;
    approvedPathRequired: boolean;
    shellFalse: boolean;
    noArbitraryShell: boolean;
    noCommandTextbox: boolean;
    noTerminal: boolean;
    noNodePty: boolean;
    noAutoGitMutation: boolean;
    noAutoDeploy: boolean;
  };
  backupPermission: PermissionSummary & {
    sqliteOnly: boolean;
    localOnly: boolean;
    restoreRequiresDryRun: boolean;
    restoreRequiresConfirm: boolean;
    safetyBackupBeforeRestore: boolean;
    noSourceBackup: boolean;
    noTokenBackup: boolean;
  };
  archivePermission: PermissionSummary & {
    dryRunOnly: boolean;
    noRealDeletion: boolean;
    noBackupFileDeletion: boolean;
    noScheduledCleanup: boolean;
  };
  launcherPermission: PermissionSummary & {
    localhostOnly: boolean;
    statusOnlyDefault: boolean;
    noDevServerStart: boolean;
    noCodexGitQualityExecution: boolean;
  };
  tauriPermission: PermissionSummary & {
    prototypeOnly: boolean;
    noProductionInstaller: boolean;
    noUpdater: boolean;
    noShellPlugin: boolean;
    noFsExpansion: boolean;
    coreDefaultOnly: boolean;
  };
  cloudPermission: PermissionSummary & {
    cloudSyncDisabled: boolean;
    githubApiDisabled: boolean;
    vercelDisabled: boolean;
    supabaseDisabled: boolean;
  };
  credentialPermission: PermissionSummary & {
    noAuthJsonRead: boolean;
    noEnvRead: boolean;
    noTokenStorage: boolean;
    noOpenAiApi: boolean;
  };
}

export interface SafetySummary {
  overallSafetyStatus: OverallSafetyStatus;
  warnings: string[];
  blockedCapabilities: SafetyCapability[];
  allowedCapabilities: SafetyCapability[];
  recommendedNextAction: string;
}

export type SensitivePathCategory =
  | "auth_file"
  | "env_file"
  | "private_key"
  | "token_or_secret"
  | "credential_file"
  | "unknown_sensitive"
  | "allowed";

export interface SensitivePathClassification {
  input: string;
  category: SensitivePathCategory;
  allowed: boolean;
  reason: string;
}

export interface SensitivePathValidationResult {
  ok: boolean;
  classification: SensitivePathClassification;
  error?: string;
}
