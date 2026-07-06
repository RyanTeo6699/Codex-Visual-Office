# Codex Visual Office - ROADMAP.md

版本：v1.0  
项目：Codex Visual Office  
路线类型：Local-first → Real Codex Integration → Desktop Shell → RC Stabilization → Future GM-approved Expansion
日期：2026-05-30  

---

## 0. Current Status

This document is a historical top-level roadmap. The active post-Phase-6 roadmap is maintained in `docs/phase-7-roadmap.md`.

Current GM-approved status as of Phase 30:

```txt
Phase 14：Release Candidate QA / Documentation Hardening completed
Phase 15：Release Candidate Stabilization / Bug Bash completed
Phase 16：Production 1.0 Scope Lock / Final RC Validation completed
Phase 17：Production 1.0 Finalization / Release Freeze completed
Phase 18：Public Release Packaging Scope Lock / Distribution Strategy completed
Phase 19：Private Local Beta Packaging Validation completed
Phase 20：Private Beta Test Round 1 / Feedback Intake completed
Phase 21：Private Beta Round 1 Execution Dry Run / Feedback Simulation completed
Phase 22：Private Beta Fix Batch 1 completed
Phase 23：Real Private Beta Round 1 Execution framework ready, awaiting tester feedback
Phase 24：Real Private Beta Feedback Review / Decision Gate completed with AWAITING_TESTER_FEEDBACK
Phase 25：Continue Real Private Beta Round 1 / Collect Tester Feedback package ready, awaiting submissions
Phase 26：Continue Real Private Beta Round 1 / Submission Collection Window completed with CONTINUE_COLLECTION
Phase 27：Continue Collection / Real Tester Outreach Execution Packet completed with CONTINUE_COLLECTION
Phase 28：Real Private Beta Feedback Review / Fix Batch Decision completed from one GM local validation sample
Phase 29：Continue Real Private Beta Collection / External Tester Intake ready, awaiting external submissions
Phase 30：Private Beta Ops Automation / Internal Execution Pack ready, awaiting external submissions
Phase 31：Local Beta Feedback Intake / Ledger UI ready, awaiting real external records
Current status：LOCAL_BETA_FEEDBACK_INTAKE_READY_AWAITING_REAL_EXTERNAL_RECORDS
Next recommendation：Manually record real, redacted external tester intake in /beta before any Phase 32 review
```

The current product remains local-first. Production release, code signing, notarization, auto updater, cloud sync, team workspace, auth, payment, MCP, ChatGPT App, OpenAI API, and external service integrations are not active capabilities.

---

## 1. 总路线

Historical route from early planning:

```txt
Phase 0：项目总控基线 / Scope Lock
Phase 1：视觉原型 / Mock Data Demo
Phase 2：本地任务系统 / Local Task System
Phase 3：本地 Codex CLI 接入 / Local Codex Runner
Phase 4：Git / 文件 / Terminal 状态监听
Phase 5：本地质量门与验收室
Phase 6：本地可用版封装
Phase 7A：Scope Lock / Roadmap Reconciliation
Phase 7B：Desktop Shell Evaluation
Phase 7C：Local Launcher
Phase 7D：Packaging Prototype
Phase 8：Codex Runtime Reliability
Phase 9：Virtual Office UI Redesign
Phase 10：Real Project Workspace Hardening
Phase 11：Codex Agent Workflow 2.0
Phase 12：Safety / Permission Hardening
Phase 13：Desktop Beta / Distribution Candidate
Phase 14：Release Candidate QA / Documentation Hardening
Phase 15：Release Candidate Stabilization / Bug Bash
Phase 16：Production 1.0 Scope Lock / Final RC Validation
Phase 17：Production 1.0 Finalization / Release Freeze
Phase 18：Public Release Packaging Scope Lock / Distribution Strategy
Phase 19：Private Local Beta Packaging Validation
Phase 20：Private Beta Test Round 1 / Feedback Intake
Phase 21：Private Beta Round 1 Execution Dry Run / Feedback Simulation
Phase 22：Private Beta Fix Batch 1
Phase 23：Real Private Beta Round 1 Execution
Phase 24：Real Private Beta Feedback Review / Decision Gate
Phase 25：Continue Real Private Beta Round 1 / Collect Tester Feedback
Phase 26：Continue Real Private Beta Round 1 / Submission Collection Window
Phase 27：Continue Collection / Real Tester Outreach Execution Packet
Phase 28：Real Private Beta Feedback Review / Fix Batch Decision
Phase 29：Continue Real Private Beta Collection / External Tester Intake
Phase 30：Private Beta Ops Automation / Internal Execution Pack
Phase 31：Local Beta Feedback Intake / Ledger UI
```

历史 PRD 1.0 首轮只执行：

```txt
Phase 1：视觉原型 / Mock Data Demo
```

Current route position:

```txt
Phase 31：Local Beta Feedback Intake / Ledger UI
当前状态：LOCAL_BETA_FEEDBACK_INTAKE_READY_AWAITING_REAL_EXTERNAL_RECORDS
当前决策：CONTINUE_EXTERNAL_TESTER_INTAKE
下一阶段建议：继续手动收集真实 external tester submissions，并在 /beta 录入已脱敏本地记录
```

---

## 2. Phase 0：项目总控基线 / Scope Lock

### 目标

建立开发边界，防止 Codex 越界开发。

### 已完成 / 应完成文件

```txt
docs/PRD.md
docs/SCOPE_LOCK.md
docs/ROADMAP.md
AGENTS.md
```

### 效果

Codex 清楚知道：

1. 当前项目是什么。
2. 当前阶段只做什么。
3. 哪些内容禁止做。
4. 未来路线是什么。
5. 当前开发必须通过哪些验收标准。

---

## 3. Phase 1：视觉原型 / Mock Data Demo

### 目标

完成可运行、可点击、可演示的前端视觉原型。

### 必须完成

```txt
Office Home
Project Room
Review Room
OfficeMap
ProjectRoomCard
AgentSeat
TaskBoard
TaskCard
BuildWall
EventTicker
ReviewPanel
QualityGatePanel
MockDiffSummary
TypeScript types
mock data
```

### 数据来源

只允许使用 mock data。

### 不允许做

```txt
OpenAI API
Codex CLI
GitHub
Vercel
Supabase
SQLite
Auth
Payment
Cloud Sync
Terminal command execution
Real file system access
```

### 完成效果

用户打开本地页面后，能看到一个像 Codex 办公室的产品原型。

### 验收标准

1. 页面能启动。
2. build 通过。
3. 有办公室视觉。
4. 有项目房间。
5. 有 Codex 工位。
6. 有任务看板。
7. 有构建状态墙。
8. 有事件流。
9. 有审查室。
10. 没有越界接入真实服务。

---

## 4. Phase 2：本地任务系统 / Local Task System

### 目标

让 mock 状态变成真实本地任务数据。

### 允许新增

```txt
SQLite
Drizzle 或 Prisma
local project records
local task records
agent seat records
task events
review records
settings
```

### 核心功能

1. 创建项目。
2. 导入项目本地路径。
3. 创建任务。
4. 分配任务给 Codex 工位。
5. 修改任务状态。
6. 保存事件记录。
7. 关闭重开后数据不丢。

### 完成效果

办公室不再只是 mock demo，而是能记录真实本地任务。

### 仍然禁止

```txt
Codex CLI
GitHub
Vercel
Supabase cloud
OpenAI API
Cloud Sync
```

---

## 5. Phase 3：本地 Codex CLI 接入 / Local Codex Runner

### 目标

让用户可以把任务派发给本地 Codex CLI。

### 允许新增

```txt
Codex CLI detection
Codex runner
terminal output capture
process status
task execution logs
local execution event stream
```

### 核心功能

1. 检查本机 Codex CLI 是否可用。
2. 选择本地项目目录。
3. 将任务 prompt 发送给 Codex CLI。
4. 捕捉 stdout / stderr。
5. 显示执行日志。
6. 更新工位状态。
7. 保存执行事件。

### 完成效果

Codex 工位开始真正工作，办公室能显示 Codex 本地执行过程。

### 禁止事项

```txt
不要保存 OpenAI 凭据
不要绕过 Codex 官方登录方式
不要自动上传代码
不要自动 push
不要自动 deploy
```

---

## 6. Phase 4：Git / 文件 / Terminal 状态监听

### 目标

显示 Codex 到底改了哪些文件。

### 允许新增

```txt
git status
git diff summary
git diff --name-status
file watcher
changed files
additions / deletions
branch display
```

### 核心功能

1. 显示当前 branch。
2. 显示 changed files。
3. 显示 additions / deletions。
4. 显示 forbidden scope 是否被触碰。
5. 记录任务开始前 / 完成后的 git snapshot。

### 完成效果

用户可以知道 Codex 动了哪里、改了多少、有没有碰禁止范围。

---

## 7. Phase 5：本地质量门与验收室

### 目标

把 Review Room 变成真实工程验收室。

### 允许新增

```txt
quality command runner
npm run typecheck
npm run build
npm run lint
git diff --check
command logs
review decisions
```

### 核心功能

1. 配置质量门命令。
2. 一键运行检查。
3. 显示实时日志。
4. 保存检查结果。
5. Approve / Reject / Ask Revision。
6. 任务归档。

### 完成效果

Codex 做完任务后，用户可以在办公室里验收结果，而不是到处翻 terminal。

---

## 8. Phase 6：本地可用版封装

### 目标

把产品变成可长期使用的个人本地工具。

### 允许新增

```txt
settings page
backup / restore
import / export
log cleanup
error recovery
local launcher
optional Tauri packaging
```

### 完成效果

个人用户可以长期用它管理 Codex 本地开发任务。

---

## 9. Phase 7A-D：本地桌面壳路线 / Desktop Shell Path

### 目标

在 Phase 6 本地产品化之后，先完成 Phase 7A-D 的本地桌面壳路线，再进入任何云同步实现。

### 阶段拆分

```txt
Phase 7A：Scope Lock / Roadmap Reconciliation
Phase 7B：Desktop Shell Evaluation
Phase 7C：Local Launcher
Phase 7D：Packaging Prototype
```

### 完成效果

产品路线先解决本地桌面启动、壳层评估和包装原型，再考虑云端能力。

### 注意

Phase 7A 只做文档和范围锁定。
Phase 7B 实现尚未开始。
云同步必须后置到 Phase 8 / Phase 9，并且必须保持可选。

---

## 10. Phase 8：Cloud Sync Planning

### 目标

规划可选云同步，不实现云同步。

### 允许新增

```txt
cloud sync architecture plan
data ownership model
offline / conflict behavior
privacy and security boundaries
optional sync UX
```

### 完成效果

明确如何在不破坏 local-first 原则的前提下，后续可选接入云同步。

---

## 11. Phase 9：Cloud Sync Implementation

### 目标

在 Phase 8 规划获批后，实现可选云同步。

### 允许新增

```txt
optional cloud sync
sync status
conflict handling
approved provider integration
```

### 完成效果

本地 Codex 执行状态可以选择性同步到云端，同时离线本地使用不受影响。

---

## 12. Phase 10：Team Workspace

### 目标

支持小团队协作。

### 允许新增

```txt
Workspace
Members
Roles
Permissions
Audit Logs
Team Review
```

### 完成效果

团队可以使用同一个 Visual Office 管理 AI coding workflow。

---

## 13. Phase 11：ChatGPT App / MCP 接入

### 目标

让 ChatGPT 可以查看和操作 Codex Visual Office。

### 允许新增

```txt
MCP Server
ChatGPT App UI
project status query
task creation
review status query
office widget
```

### 完成效果

用户可以在 ChatGPT 内查看办公室状态、查询任务、创建任务或进入验收流程。

---

## 当前阶段提醒

历史 PRD 1.0 阶段提醒只允许执行：

```txt
Phase 1：视觉原型
```

当前仓库已完成 Phase 6 closeout，并处于 Phase 7A docs-only roadmap reconciliation。
Phase 7B Desktop Shell Evaluation 尚未开始，必须等待 GM 明确批准。

不要提前做：

```txt
Phase 2 SQLite
Phase 3 Codex CLI
Phase 4 Git watcher
Phase 5 real quality gates
Phase 7A-D desktop shell path
Phase 8 cloud sync planning
Phase 9 cloud sync implementation
Phase 10 team
Phase 11 ChatGPT App / MCP
```

任何跨阶段开发都必须先经过 GM 明确批准。
