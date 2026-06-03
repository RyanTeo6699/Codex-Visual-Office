import type { QualityGateConfig, QualityGateRun } from "@/lib/types";

export interface QualityGateCommandPlan {
  commandKey: QualityGateConfig["commandKey"];
  command: string;
  executable: "npm" | "git";
  args: string[];
  shell: false;
  requiredPackageScript?: string;
}

export interface QualityGateOutputCapture {
  preview: string;
  truncated: boolean;
}

export interface RunQualityGateConfigInput {
  taskId: string;
  projectId: string;
  config: QualityGateConfig;
  cwd: string;
}

export interface RunEnabledQualityGatesInput {
  taskId: string;
  projectId: string;
  configs: QualityGateConfig[];
  cwd: string;
}

export interface RunEnabledQualityGatesOutput {
  runs: QualityGateRun[];
}
