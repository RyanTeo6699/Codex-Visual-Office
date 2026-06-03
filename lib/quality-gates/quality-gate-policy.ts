import type { QualityGateCommandKey, QualityGateConfig } from "@/lib/types";
import { qualityGateCommandCatalog } from "@/lib/local-db/operations/quality-gate-configs";
import type { QualityGateCommandPlan } from "./quality-gate-runner-types";

export const qualityGateCommandPlans: Record<QualityGateCommandKey, QualityGateCommandPlan> = {
  npm_typecheck: {
    commandKey: "npm_typecheck",
    command: "npm run typecheck",
    executable: "npm",
    args: ["run", "typecheck"],
    shell: false,
    requiredPackageScript: "typecheck",
  },
  npm_build: {
    commandKey: "npm_build",
    command: "npm run build",
    executable: "npm",
    args: ["run", "build"],
    shell: false,
    requiredPackageScript: "build",
  },
  npm_lint: {
    commandKey: "npm_lint",
    command: "npm run lint",
    executable: "npm",
    args: ["run", "lint"],
    shell: false,
    requiredPackageScript: "lint",
  },
  npm_test: {
    commandKey: "npm_test",
    command: "npm test",
    executable: "npm",
    args: ["test"],
    shell: false,
    requiredPackageScript: "test",
  },
  npm_run_test: {
    commandKey: "npm_run_test",
    command: "npm run test",
    executable: "npm",
    args: ["run", "test"],
    shell: false,
    requiredPackageScript: "test",
  },
  git_diff_check: {
    commandKey: "git_diff_check",
    command: "git diff --check",
    executable: "git",
    args: ["diff", "--check"],
    shell: false,
  },
};

export function buildQualityGateCommandPlan(config: QualityGateConfig): QualityGateCommandPlan {
  const catalogEntry = qualityGateCommandCatalog[config.commandKey];
  const plan = qualityGateCommandPlans[config.commandKey];

  if (!catalogEntry || !plan) {
    throw new Error(`Quality gate command key is not allowlisted: ${config.commandKey}`);
  }

  if (!config.allowlisted) {
    throw new Error(`Quality gate config is not allowlisted: ${config.id}`);
  }

  if (config.command !== catalogEntry.command || config.command !== plan.command) {
    throw new Error(`Quality gate command text does not match allowlist for ${config.commandKey}`);
  }

  return plan;
}
