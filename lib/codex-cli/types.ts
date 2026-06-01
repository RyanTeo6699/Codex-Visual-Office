export type CodexCliAuthStatus = "unknown" | "not_checked" | "cli_unavailable" | "cli_available_auth_not_verified";

export interface CodexCliStatus {
  installed: boolean;
  path?: string;
  version?: string;
  authStatus: CodexCliAuthStatus;
  detectionMode: "safe_detection_only";
  checkedAt: string;
  errors?: string[];
}
