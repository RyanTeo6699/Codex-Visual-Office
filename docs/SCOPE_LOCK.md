# Codex Visual Office - SCOPE_LOCK.md

版本：v1.0  
项目：Codex Visual Office  
阶段：Phase 17 - Production 1.0 Finalization / Release Freeze
状态：Locked  
当前目标：冻结 local-first Production 1.0 baseline 并完成 release freeze
运行形态：Local-first Web App  
日期：2026-05-30  

---

## 0. Current Scope Notice

This file began as the Phase 1 scope lock. The current active scope is Phase 17:

```txt
Phase 17 - Production 1.0 Finalization / Release Freeze
```

Current active scope documents:

- `docs/phase-17-production-1-finalization-release-freeze-scope-lock.md`
- `docs/release-notes-1.0.md`
- `docs/final-acceptance-report-1.0.md`
- `docs/final-verification-manifest-1.0.md`
- `docs/known-limitations-1.0.md`
- `RELEASE_STATUS.md`

Phase 17 is documentation and verification only. It does not start public commercial launch, code signing, notarization, auto updater, cloud sync, auth/payment/team/MCP/ChatGPT App, OpenAI API, DB schema work, dependency changes, destructive cleanup, or Phase 18.

## 1. Scope Lock 结论

Historical Phase 1 baseline allowed:

> **Codex Visual Office Phase 1：基于 mock data 的本地前端视觉原型。**

本阶段目标不是做完整产品，也不是接入真实 Codex。  
本阶段只验证：

1. 办公室视觉是否成立。
2. 项目房间是否清晰。
3. Codex 工位是否直观。
4. 任务状态是否可读。
5. Build Wall / Event Ticker / Review Room 是否构成完整产品骨架。
6. 后续接入 Codex CLI、Git、SQLite 时是否不需要推倒重来。

---

## 2. 当前阶段允许做什么

Phase 1 只允许做以下内容：

### 2.1 页面

允许创建：

```txt
/
  Office Home

/projects/[id]
  Project Room

/review/[taskId]
  Review Room
```

### 2.2 组件

允许创建：

```txt
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
TaskStatusBadge
AppShell
Sidebar
TopBar
```

### 2.3 数据

允许使用：

```txt
mock projects
mock agent seats
mock tasks
mock task events
mock build checks
mock diff summaries
```

所有数据必须来自：

```txt
lib/mock-data.ts
```

### 2.4 类型

允许创建 TypeScript 类型：

```txt
Project
AgentSeat
Task
BuildCheck
TaskEvent
ReviewRecord
```

类型文件放在：

```txt
lib/types.ts
```

### 2.5 UI 风格

允许实现：

```txt
dark engineering command center
2D / isometric office feel
agent workspace
project rooms
visual task states
build status wall
review room
```

---

## 3. 当前阶段禁止做什么

Phase 1 严禁做以下内容：

### 3.1 禁止真实 AI / Codex 接入

```txt
禁止调用 OpenAI API
禁止接入 Codex CLI
禁止读取 Codex App 数据
禁止模拟用户 ChatGPT 登录
禁止保存 OpenAI 凭据
禁止写任何 Codex Runner
```

### 3.2 禁止真实本地系统接入

```txt
禁止读取真实本地文件系统
禁止扫描用户电脑目录
禁止执行 terminal 命令
禁止调用 child_process
禁止使用 node-pty
禁止运行真实 npm command
禁止读取真实 git status
禁止读取真实 git diff
```

### 3.3 禁止云服务接入

```txt
禁止 GitHub App
禁止 GitHub OAuth
禁止 GitHub API
禁止 Vercel Webhook
禁止 Supabase
禁止 Firebase
禁止 PlanetScale
禁止任何远程数据库
禁止云同步
```

### 3.4 禁止账号 / 商业系统

```txt
禁止登录注册
禁止团队成员
禁止权限系统
禁止组织 Workspace
禁止付款系统
禁止 Pricing 页面
禁止订阅系统
```

### 3.5 禁止后端膨胀

```txt
禁止创建真实 backend service
禁止 API route 执行业务逻辑
禁止创建 queue / worker
禁止创建 daemon
禁止创建 websocket server
禁止创建 MCP server
```

---

## 4. 当前阶段必须交付什么

Phase 1 完成后必须交付：

1. 本地可运行 Next.js 项目。
2. Office Home 总办公室页面。
3. Project Room 项目房间页面。
4. Review Room 审查室页面。
5. 至少 5 个 mock projects。
6. 至少 3 个 mock Codex seats。
7. 至少 8 个 mock tasks。
8. 至少 12 个 mock events。
9. 至少 8 个 mock build checks。
10. 清晰 TypeScript 类型。
11. 清晰组件结构。
12. 视觉上不是普通 dashboard，而是 Codex 可视化办公室。

---

## 5. 当前阶段成功标准

Phase 1 成功标准：

> 打开页面后，用户第一眼觉得：这是 Codex 的可视化办公室，而不是普通后台模板。

第二成功标准：

> 用户能一眼看懂项目、工位、任务、状态、构建、审查之间的关系。

第三成功标准：

> 后续 Phase 2 / Phase 3 可以继续接 SQLite / Codex CLI / Git，不需要推翻当前结构。

---

## 6. 当前阶段失败标准

出现以下情况即判定 Phase 1 失败：

1. 页面像普通 Admin Dashboard。
2. 看不出办公室感。
3. 看不出 Codex 工位概念。
4. 项目、任务、工位关系混乱。
5. Codex 自作主张接入真实服务。
6. Codex 添加 OpenAI API、GitHub、Supabase、Vercel。
7. 组件结构混乱，不利于后续扩展。
8. build 无法通过。
9. TypeScript 类型混乱。
10. UI 只有卡片堆叠，没有空间感。

---

## 7. 质量门

Phase 1 开发完成后必须通过：

```bash
npm run typecheck
npm run build
```

如果项目没有 typecheck script，必须至少保证：

```bash
npm run build
```

通过。

---

## 8. 当前阶段交付后下一阶段

Phase 1 完成并验收后，才能进入：

> Phase 2：Local Task System / 本地任务系统

Phase 2 才允许引入：

```txt
SQLite
local task persistence
project creation
task creation
agent seat assignment
event persistence
```

Phase 1 不允许提前做 Phase 2 内容。

---

## 9. 总结

当前 Scope Lock：

```txt
只做视觉原型
只用 mock data
只做前端
不接真实 Codex
不接真实 Git
不接云服务
不做登录
不做付款
不做团队
```

任何超出此范围的实现，都必须停止并重新回到 Scope Lock。
