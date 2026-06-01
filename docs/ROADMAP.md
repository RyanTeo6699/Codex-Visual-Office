# Codex Visual Office - ROADMAP.md

版本：v1.0  
项目：Codex Visual Office  
路线类型：Local-first → Real Codex Integration → Cloud Sync → Team / ChatGPT App  
日期：2026-05-30  

---

## 1. 总路线

Codex Visual Office 的完整路线分为 10 个阶段：

```txt
Phase 0：项目总控基线 / Scope Lock
Phase 1：视觉原型 / Mock Data Demo
Phase 2：本地任务系统 / Local Task System
Phase 3：本地 Codex CLI 接入 / Local Codex Runner
Phase 4：Git / 文件 / Terminal 状态监听
Phase 5：本地质量门与验收室
Phase 6：本地可用版封装
Phase 7：云同步与 GitHub / Vercel 集成
Phase 8：团队版与权限系统
Phase 9：ChatGPT App / MCP 接入
Phase 10：商业化完整版
```

当前只执行：

```txt
Phase 1：视觉原型 / Mock Data Demo
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

## 9. Phase 7：云同步与 GitHub / Vercel 集成

### 目标

在本地体验成立后，才接入云端工程状态。

### 允许新增

```txt
Supabase cloud sync
GitHub App
GitHub PR sync
GitHub Checks sync
Vercel Preview sync
Deployment status
```

### 完成效果

本地 Codex 执行状态可以和 GitHub PR、Vercel Preview、云端任务状态同步。

### 注意

云同步必须是可选功能。  
不能破坏 local-first 原则。

---

## 10. Phase 8：团队版与权限系统

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

### 角色

```txt
owner
admin
developer
reviewer
viewer
```

### 完成效果

团队可以使用同一个 Visual Office 管理 AI coding workflow。

---

## 11. Phase 9：ChatGPT App / MCP 接入

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

用户可以在 ChatGPT 内说：

```txt
查看我的 Codex Office
列出阻塞任务
打开当前 Review Room
创建一个 Codex 任务
```

---

## 12. Phase 10：商业化完整版

### 目标

形成可销售产品。

### 可能版本

```txt
Free / Local
Pro
Team
Enterprise
Self-hosted
```

### 商业能力

```txt
plans
billing
team workspace
advanced audit
self-hosting
plugin system
enterprise deployment
```

---

## 13. 当前阶段提醒

当前仍然只允许执行：

```txt
Phase 1：视觉原型
```

不要提前做：

```txt
Phase 2 SQLite
Phase 3 Codex CLI
Phase 4 Git watcher
Phase 5 real quality gates
Phase 7 cloud sync
Phase 8 team
Phase 9 ChatGPT App
```

任何跨阶段开发都必须先经过 GM 明确批准。
