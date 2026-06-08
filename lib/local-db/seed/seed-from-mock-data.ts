import {
  agentSeats,
  buildChecks,
  projects,
  reviewRecords,
  taskEvents,
  tasks,
} from "@/lib/mock-data";
import { db } from "../client";
import type {
  NewAgentSeatRow,
} from "../repositories/agent-seats";
import type { NewBuildCheckRow } from "../repositories/build-checks";
import type { NewLocalSettingRow } from "../repositories/local-settings";
import type { NewProjectRow } from "../repositories/projects";
import type { NewQualityGateConfigRow } from "../repositories/quality-gate-configs";
import type { NewReviewRecordRow } from "../repositories/review-records";
import type { NewSettingRow } from "../repositories/settings";
import type { NewTaskEventRow } from "../repositories/task-events";
import type { NewTaskRow } from "../repositories/tasks";
import {
  agentSeats as agentSeatsTable,
  buildChecks as buildChecksTable,
  localSettings as localSettingsTable,
  projects as projectsTable,
  qualityGateConfigs as qualityGateConfigsTable,
  reviewRecords as reviewRecordsTable,
  settings as settingsTable,
  taskEvents as taskEventsTable,
  tasks as tasksTable,
} from "../schema";
import { qualityGateCommandCatalog, qualityGateCommandKeys } from "../operations/quality-gate-configs";
import { defaultLocalSettings } from "../operations/local-settings";

const seedTimestamp = "2026-05-31T00:00:00.000Z";

// Phase 2 Step 2 seed helpers.
// Do not run this automatically on app startup. UI integration starts in a later step.
export function mapMockProjectsToSeedRows(): NewProjectRow[] {
  return projects.map((project) => ({
    id: project.id,
    name: project.name,
    description: project.summary,
    phase: project.phase,
    status: project.status,
    localPath: project.localPathPlaceholder,
    accent: project.accent,
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockAgentSeatsToSeedRows(): NewAgentSeatRow[] {
  return agentSeats.map((agentSeat) => ({
    id: agentSeat.id,
    name: agentSeat.name,
    agentType: "codex",
    status: agentSeat.status,
    currentTaskId: agentSeat.taskId ?? null,
    currentProjectId: agentSeat.projectId,
    focus: agentSeat.focus,
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockTasksToSeedRows(): NewTaskRow[] {
  return tasks.map((task) => ({
    id: task.id,
    projectId: task.projectId,
    title: task.title,
    summary: "",
    status: task.status,
    priority: task.priority,
    assignedSeatId: task.agentSeatId ?? null,
    acceptanceCriteriaJson: JSON.stringify(task.acceptanceCriteria),
    forbiddenScopeJson: JSON.stringify(task.forbiddenScope),
    changedFilesJson: JSON.stringify(task.changedFiles),
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockTaskEventsToSeedRows(): NewTaskEventRow[] {
  return taskEvents.map((event) => ({
    id: event.id,
    taskId: event.taskId ?? null,
    projectId: event.projectId,
    seatId: event.agentSeatId ?? null,
    type: event.tone,
    message: event.message,
    payloadJson: JSON.stringify({ displayTime: event.time }),
    createdAt: seedTimestamp,
  }));
}

export function mapMockBuildChecksToSeedRows(): NewBuildCheckRow[] {
  return buildChecks.map((check) => ({
    id: check.id,
    projectId: check.projectId,
    taskId: check.taskId ?? null,
    name: check.label,
    status: check.status,
    message: check.detail,
    createdAt: seedTimestamp,
    updatedAt: seedTimestamp,
  }));
}

export function mapMockReviewRecordsToSeedRows(): NewReviewRecordRow[] {
  return reviewRecords.map((reviewRecord) => ({
    id: `review-${reviewRecord.taskId}`,
    taskId: reviewRecord.taskId,
    decision: reviewRecord.decision,
    notes: "",
    diffSummaryJson: JSON.stringify(reviewRecord.diffSummary),
    riskNotesJson: JSON.stringify(reviewRecord.riskNotes),
    qualityGateIdsJson: JSON.stringify(reviewRecord.qualityGateIds),
    createdAt: seedTimestamp,
  }));
}

export function mapSettingsToSeedRows(): NewSettingRow[] {
  return [
    {
      key: "schema_version",
      valueJson: JSON.stringify("phase-2-step-2"),
      updatedAt: seedTimestamp,
    },
    {
      key: "seed_version",
      valueJson: JSON.stringify("phase-1-mock-data-v1"),
      updatedAt: seedTimestamp,
    },
  ];
}

export function mapDefaultQualityGateConfigsToSeedRows(): NewQualityGateConfigRow[] {
  return projects.flatMap((project) => {
    return qualityGateCommandKeys.map((commandKey) => {
      const definition = qualityGateCommandCatalog[commandKey];
      return {
        id: `quality-gate-config-${project.id}-${commandKey}`,
        projectId: project.id,
        name: definition.name,
        commandKey,
        command: definition.command,
        enabled: definition.defaultEnabled,
        allowlisted: true,
        description: definition.description,
        createdAt: seedTimestamp,
        updatedAt: seedTimestamp,
      };
    });
  });
}

export function mapDefaultLocalSettingsToSeedRows(): NewLocalSettingRow[] {
  return defaultLocalSettings.map((setting) => ({
    key: setting.key,
    valueJson: JSON.stringify(setting.value),
    category: setting.category,
    description: setting.description,
    updatedAt: seedTimestamp,
  }));
}

export function seedFromMockData(): void {
  db.transaction((tx) => {
    for (const project of mapMockProjectsToSeedRows()) {
      tx.insert(projectsTable).values(project).onConflictDoUpdate({
        target: projectsTable.id,
        set: {
          name: project.name,
          description: project.description,
          phase: project.phase,
          status: project.status,
          localPath: project.localPath,
          accent: project.accent,
          updatedAt: project.updatedAt,
        },
      }).run();
    }

    for (const agentSeat of mapMockAgentSeatsToSeedRows()) {
      tx.insert(agentSeatsTable).values(agentSeat).onConflictDoUpdate({
        target: agentSeatsTable.id,
        set: {
          name: agentSeat.name,
          agentType: agentSeat.agentType,
          status: agentSeat.status,
          currentTaskId: agentSeat.currentTaskId,
          currentProjectId: agentSeat.currentProjectId,
          focus: agentSeat.focus,
          updatedAt: agentSeat.updatedAt,
        },
      }).run();
    }

    for (const task of mapMockTasksToSeedRows()) {
      tx.insert(tasksTable).values(task).onConflictDoUpdate({
        target: tasksTable.id,
        set: {
          projectId: task.projectId,
          title: task.title,
          summary: task.summary,
          status: task.status,
          priority: task.priority,
          assignedSeatId: task.assignedSeatId,
          acceptanceCriteriaJson: task.acceptanceCriteriaJson,
          forbiddenScopeJson: task.forbiddenScopeJson,
          changedFilesJson: task.changedFilesJson,
          updatedAt: task.updatedAt,
        },
      }).run();
    }

    for (const taskEvent of mapMockTaskEventsToSeedRows()) {
      tx.insert(taskEventsTable).values(taskEvent).onConflictDoUpdate({
        target: taskEventsTable.id,
        set: {
          taskId: taskEvent.taskId,
          projectId: taskEvent.projectId,
          seatId: taskEvent.seatId,
          type: taskEvent.type,
          message: taskEvent.message,
          payloadJson: taskEvent.payloadJson,
          createdAt: taskEvent.createdAt,
        },
      }).run();
    }

    for (const buildCheck of mapMockBuildChecksToSeedRows()) {
      tx.insert(buildChecksTable).values(buildCheck).onConflictDoUpdate({
        target: buildChecksTable.id,
        set: {
          projectId: buildCheck.projectId,
          taskId: buildCheck.taskId,
          name: buildCheck.name,
          status: buildCheck.status,
          message: buildCheck.message,
          updatedAt: buildCheck.updatedAt,
        },
      }).run();
    }

    for (const reviewRecord of mapMockReviewRecordsToSeedRows()) {
      tx.insert(reviewRecordsTable).values(reviewRecord).onConflictDoUpdate({
        target: reviewRecordsTable.id,
        set: {
          taskId: reviewRecord.taskId,
          decision: reviewRecord.decision,
          notes: reviewRecord.notes,
          diffSummaryJson: reviewRecord.diffSummaryJson,
          riskNotesJson: reviewRecord.riskNotesJson,
          qualityGateIdsJson: reviewRecord.qualityGateIdsJson,
        },
      }).run();
    }

    for (const setting of mapSettingsToSeedRows()) {
      tx.insert(settingsTable).values(setting).onConflictDoUpdate({
        target: settingsTable.key,
        set: {
          valueJson: setting.valueJson,
          updatedAt: setting.updatedAt,
        },
      }).run();
    }

    for (const qualityGateConfig of mapDefaultQualityGateConfigsToSeedRows()) {
      tx.insert(qualityGateConfigsTable).values(qualityGateConfig).onConflictDoUpdate({
        target: qualityGateConfigsTable.id,
        set: {
          projectId: qualityGateConfig.projectId,
          name: qualityGateConfig.name,
          commandKey: qualityGateConfig.commandKey,
          command: qualityGateConfig.command,
          enabled: qualityGateConfig.enabled,
          allowlisted: qualityGateConfig.allowlisted,
          description: qualityGateConfig.description,
          updatedAt: qualityGateConfig.updatedAt,
        },
      }).run();
    }

    for (const localSetting of mapDefaultLocalSettingsToSeedRows()) {
      tx.insert(localSettingsTable).values(localSetting).onConflictDoUpdate({
        target: localSettingsTable.key,
        set: {
          valueJson: localSetting.valueJson,
          category: localSetting.category,
          description: localSetting.description,
          updatedAt: localSetting.updatedAt,
        },
      }).run();
    }
  });
}
