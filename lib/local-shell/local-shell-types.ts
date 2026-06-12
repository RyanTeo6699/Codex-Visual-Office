export type LocalShellReadiness = "ready_for_local_dev" | "partial" | "blocked";
export type DesktopPackagingStatus = "future_evaluation";

export interface LocalShellCounts {
  approvedProjectPaths: number;
  backupRecords: number;
  retentionPolicies: number;
  qualityGateConfigs: number;
  archiveRecords: number;
}

export interface ForbiddenLocalShellCapabilities {
  tauri: boolean;
  electron: boolean;
  autoUpdater: boolean;
  backgroundDaemon: boolean;
  cloudSync: boolean;
  githubApi: boolean;
  vercel: boolean;
  supabase: boolean;
  authPaymentMcp: boolean;
  dangerousCommandRunner: boolean;
}

export interface LocalShellExecutionAttempted {
  codex: boolean;
  git: boolean;
  qualityGate: boolean;
  devServer: boolean;
  install: boolean;
  deploy: boolean;
}

export interface LocalShellStatus {
  localModeEnabled: boolean;
  localDatabaseConfigured: boolean;
  localDatabasePath: string;
  settingsCenterReady: boolean;
  approvedProjectPathsReady: boolean;
  backupRestoreReady: boolean;
  archiveRoomReady: boolean;
  codexCliDetected: boolean;
  codexCliStatusLabel: string;
  qualityGatesConfigured: boolean;
  localLaunchScriptsAvailable: string[];
  desktopPackagingStatus: DesktopPackagingStatus;
  shellReadiness: LocalShellReadiness;
  counts: LocalShellCounts;
  forbiddenCapabilities: ForbiddenLocalShellCapabilities;
  executionAttempted: LocalShellExecutionAttempted;
}
