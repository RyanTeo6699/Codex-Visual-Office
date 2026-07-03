export type DesktopBetaSafetyStatus = "safe_beta_candidate" | "needs_review" | "blocked" | "unknown";

export interface DesktopBetaStatus {
  tauriPrototypeConfigured: boolean;
  desktopBetaCandidateConfigured: boolean;
  appName: string;
  appVersion: string;
  macFirst: boolean;
  browserLauncherFallbackAvailable: boolean;
  productionReleaseImplemented: boolean;
  codeSigningImplemented: boolean;
  notarizationImplemented: boolean;
  autoUpdaterImplemented: boolean;
  electronImplemented: boolean;
  cloudSyncImplemented: boolean;
  safetyStatus: DesktopBetaSafetyStatus;
  warnings: string[];
  recommendedNextAction: string;
}

export interface DesktopBetaPackageMetadata {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export interface DesktopBetaTauriConfigMetadata {
  productName?: string;
  version?: string;
  identifier?: string;
  build?: {
    devUrl?: string;
    beforeDevCommand?: string;
    beforeBuildCommand?: string;
    frontendDist?: string;
  };
  bundle?: {
    active?: boolean;
    targets?: unknown[];
    macOS?: Record<string, unknown>;
  };
  plugins?: Record<string, unknown>;
  app?: {
    windows?: Array<{
      title?: string;
      width?: number;
      height?: number;
      minWidth?: number;
      minHeight?: number;
    }>;
  };
}
