# Codex Visual Office PRD 1.0

版本：v1.0  
项目名称：Codex Visual Office  
中文名：ChatGPT + Codex 可视化办公室  
内部简称：CVO  
阶段：Phase 1 - Visual Prototype / 视觉原型  
运行形态：本地 Web App / Local-first Web App  
目标交付：可运行、可点击、可演示的前端视觉原型  
当前日期：2026-05-30  

---

## 1. 项目背景

Codex Visual Office 是一个专门为 ChatGPT + Codex 工作流设计的可视化办公室系统。

当前 ChatGPT 与 Codex 的使用方式存在明显割裂：

- ChatGPT 适合做项目判断、任务拆解、阶段规划、Codex Prompt 生成。
- Codex 适合执行代码修改、运行检查、修复错误、输出 diff。
- 但两者之间缺少一个统一、可视化、可追踪、可验收的工作空间。

现有 GitHub Project、Notion、Linear、Trello 等工具可以管理任务，但它们不是为 Codex 工作过程设计的。  
现有 Codex CLI / Codex App 可以执行任务，但它们不提供“办公室式”的可视化总控体验。

因此，本项目要做的是：

> 一个本地优先的 ChatGPT + Codex 可视化办公室，把 Codex 的项目、工位、任务、状态、构建、审查、验收流程用视觉化方式呈现出来。

---

## 2. 产品一句话定位

**Codex Visual Office 是一个本地优先的可视化办公室，用来展示、管理和验收 Codex 在本地项目中的开发过程。**

它不是：

- OpenClaw
- Star Office 复刻
- GitHub Project
- Notion 看板
- 普通 AI Chat UI
- 云端 SaaS 起步项目
- OpenAI API wrapper

它是：

> ChatGPT 负责总控思考，Codex 负责本地开发执行，Visual Office 负责可视化、记录、检查、验收。

---

## 3. 产品目标

### 3.1 长期目标

最终产品要成为一个完整的 AI 工程办公室：

- 用户可以创建多个项目房间。
- 每个项目房间可以绑定一个本地项目。
- 每个项目可以分配给不同 Codex 工位。
- 每个 Codex 工位可以显示任务状态。
- 系统可以显示任务、事件、文件改动、构建状态、验收结果。
- 后期可以接入本地 Codex CLI、Git、质量门命令、GitHub、Vercel、Supabase、ChatGPT App / MCP。

### 3.2 PRD 1.0 目标

PRD 1.0 只做 Phase 1：

> **完成一个可运行、可点击、可演示的 Codex Visual Office 前端视觉原型。**

本阶段只使用 mock data，不接入真实 Codex、不接入真实 Git、不接入任何云服务。

---

## 4. 当前版本范围

### 4.1 本版本必须做

PRD 1.0 / Phase 1 必须完成：

1. 总办公室页面 Office Home
2. 项目房间 Project Room
3. Codex 工位 Codex Seat
4. 任务卡片 Task Card
5. 任务看板 Task Board
6. 构建状态墙 Build Wall
7. 实时事件流 Event Ticker
8. 审查室 Review Room
9. Mock diff summary
10. Mock quality gate
11. Approve / Reject / Ask Revision 前端状态切换
12. TypeScript 类型定义
13. Mock data 数据源
14. 清晰组件结构
15. 可本地启动运行

### 4.2 本版本禁止做

PRD 1.0 / Phase 1 禁止做：

1. 不调用 OpenAI API
2. 不接入 Codex CLI
3. 不读取本地文件系统
4. 不执行真实 terminal 命令
5. 不读取真实 git status
6. 不读取真实 git diff
7. 不接 GitHub App
8. 不接 Vercel Webhook
9. 不接 Supabase
10. 不做登录注册
11. 不做团队权限
12. 不做付费系统
13. 不做 ChatGPT App / MCP
14. 不做云同步
15. 不做自动部署
16. 不做真实后台服务

---

## 5. 目标用户

### 5.1 第一目标用户

- 重度 ChatGPT + Codex 用户
- 独立开发者
- 独立创业者
- 多项目同时推进的人
- 希望用 Codex 本地开发但需要可视化总控的人
- 不想额外消耗 OpenAI API 费用的人

### 5.2 第二目标用户

- 小团队技术负责人
- AI coding workflow 管理者
- 希望把 AI agent 工作过程可视化的人
- 需要审查 AI 代码交付结果的人

---

## 6. 用户痛点

当前 ChatGPT + Codex 工作流的问题：

1. ChatGPT 负责思考，但执行结果散落在 Codex、terminal、git、浏览器中。
2. Codex 在 terminal / App 里工作，过程不够视觉化。
3. 多个任务同时进行时，很难一眼看出哪个任务在跑、哪个任务卡住、哪个任务等待验收。
4. 文件改动需要人工自己查 git status / git diff。
5. 质量门检查结果分散在 terminal 输出里。
6. 任务完成后缺少统一的 Review Room。
7. 失败、返工、阻塞、验收记录没有结构化沉淀。
8. 非技术老板或产品负责人很难看懂 Codex 到底在做什么。

---

## 7. 产品价值

Codex Visual Office 要提供的核心价值：

1. 让 Codex 的工作过程可视化。
2. 让本地开发任务可管理。
3. 让任务状态、工位状态、项目状态一眼可见。
4. 让文件改动、构建结果、验收结果进入统一空间。
5. 让 ChatGPT 总控和 Codex 执行形成闭环。
6. 让 AI 工程工作从“黑箱”变成“可观察、可审查、可归档”。

核心价值判断：

> 如果它只是 Codex 小人坐办公室，就是玩具。  
> 如果它能把任务、状态、diff、检查、验收全部可视化，它就是 AI 工程管理系统。

---

## 8. 产品原则

### 8.1 本地优先

第一版运行在本地：

```txt
http://localhost:3000
```

不做云端 SaaS 起步。

### 8.2 不额外调用 OpenAI API

第一版不调用 OpenAI API。

产品逻辑是：

- 用户已经有 ChatGPT / Codex 使用权。
- ChatGPT 负责总控规划。
- Codex 后期通过本地 CLI 执行。
- Visual Office 只负责可视化、记录和验收。

### 8.3 先视觉体验，后真实执行

第一阶段只验证视觉产品形态。

正确顺序：

1. 先做办公室视觉原型。
2. 再做本地任务系统。
3. 再接 Codex CLI。
4. 再接 Git / 文件监听。
5. 再做质量门与验收室。
6. 最后才做云同步和团队版。

### 8.4 不要提前基础设施膨胀

第一版不做：

- GitHub App
- Vercel Webhook
- Supabase 云同步
- Auth
- Team Workspace
- Billing

这些全部后置。

---

## 9. MVP 用户路径

### 9.1 主路径

1. 用户打开 Codex Visual Office。
2. 用户看到一个 AI 工程办公室，而不是普通 dashboard。
3. 用户看到多个项目房间。
4. 用户看到多个 Codex 工位。
5. 用户看到任务卡片。
6. 用户看到哪个任务正在运行、哪个任务阻塞、哪个任务等待验收。
7. 用户点击项目房间进入 Project Room。
8. 用户点击任务进入 Review Room。
9. 用户查看 mock diff summary 和 mock quality gate。
10. 用户点击 Approve / Reject / Ask Revision。
11. UI 状态发生变化。
12. 用户能理解这个产品未来接入 Codex CLI 后的真实工作方式。

### 9.2 第一眼验收

首页打开后，用户必须第一眼感受到：

> 这是 Codex 的可视化办公室，不是普通后台模板。

---

## 10. 信息架构

PRD 1.0 包含三个核心页面：

```txt
/
  Office Home 总办公室

/projects/[id]
  Project Room 项目房间

/review/[taskId]
  Review Room 审查室
```

---

## 11. 页面需求

## 11.1 Office Home 总办公室

### 页面目标

打开应用后，用户能看到一个完整的 AI 工程办公室总览。

### 必须展示

1. Office Header / 顶部总控信息
2. Project Rooms / 项目房间列表
3. Codex Seats / Codex 工位区
4. Task Board / 任务看板
5. Build Wall / 构建状态墙
6. Event Ticker / 事件流
7. Waiting Review / 等待验收任务
8. Blocked / 阻塞任务

### 示例项目房间

- Tuohang Main Site
- Provider Workspace
- Sanyang Temple Portal
- AI Concierge
- Content Engine

### 示例 Codex 工位

- Codex Seat 1
- Codex Seat 2
- Codex Seat 3

### 工位状态

英文状态：

```txt
Idle
Reading Repo
Planning
Editing
Running Checks
Build Failed
Fixing
Waiting Review
Done
Blocked
```

中文状态：

```txt
待命
读取项目
规划中
修改代码
运行检查
构建失败
修复中
等待验收
完成
阻塞
```

### 页面交互

1. 点击项目房间进入 `/projects/[id]`。
2. 点击任务卡进入 `/review/[taskId]`。
3. 点击工位可以显示当前工位详情弹层或侧栏。
4. Build Wall 状态为 mock。
5. Event Ticker 使用 mock event。

---

## 11.2 Project Room 项目房间

### 页面目标

每个项目有独立房间，用于展示项目当前阶段、任务、工位、检查状态。

### 必须展示

1. 项目名称
2. 项目描述
3. 当前阶段
4. 项目状态
5. 本地路径占位
6. 当前任务列表
7. 当前 Codex 工位
8. 最近事件
9. 构建状态
10. Review Room 入口

### Mock 项目示例

```json
{
  "name": "Tuohang Main Site",
  "phase": "Homepage UX Polish",
  "status": "active",
  "currentTask": "Fix mobile hero section",
  "assignedSeat": "Codex Seat 1"
}
```

### 页面交互

1. 点击任务进入 Review Room。
2. 点击返回按钮回到 Office Home。
3. 项目状态、任务状态均来自 mock data。

---

## 11.3 Codex Seat 工位

### 页面目标

每个 Codex 工位像办公室里的一个工作位，展示当前 agent 状态。

### 必须展示

1. 工位名称
2. Agent 类型
3. 当前状态
4. 当前任务
5. 当前项目
6. 状态动画或视觉符号
7. 最近事件
8. 下一步动作

### 状态视觉建议

```txt
Idle           -> 坐着待命
Reading Repo   -> 看文件
Planning       -> 看白板
Editing        -> 打字
Running Checks -> 看 terminal
Build Failed   -> 红色警报
Fixing         -> 修复中
Waiting Review -> 举手等待
Done           -> 任务完成
Blocked        -> 卡住
```

PRD 1.0 不要求复杂动画，但必须有明显状态差异。

---

## 11.4 Task Board 任务看板

### 页面目标

显示所有任务，并按状态分组。

### 状态分组

```txt
Backlog
Ready
Running
Waiting Review
Blocked
Done
```

### 任务卡字段

1. id
2. title
3. project
4. assignedSeat
5. status
6. priority
7. summary
8. acceptanceCriteria
9. forbiddenScope
10. createdAt
11. updatedAt

### 示例任务

```json
{
  "title": "Fix homepage mobile hero spacing",
  "project": "Tuohang Main Site",
  "assignedSeat": "Codex Seat 1",
  "status": "running",
  "priority": "high",
  "summary": "Improve mobile layout without touching desktop hero logic.",
  "acceptanceCriteria": [
    "Mobile hero spacing looks correct",
    "Desktop layout unchanged",
    "Build passes"
  ],
  "forbiddenScope": [
    "Do not modify Supabase schema",
    "Do not touch auth logic"
  ]
}
```

---

## 11.5 Build Wall 构建状态墙

### 页面目标

展示项目或任务的质量门状态。

PRD 1.0 只使用 mock data。

### 检查项

```txt
typecheck
build
lint
unit test
git diff check
preview
```

### 状态值

```txt
pending
running
passed
failed
skipped
```

### 视觉要求

1. passed 应明显表示通过。
2. failed 应明显表示失败。
3. running 应明显表示进行中。
4. pending / skipped 要低优先级展示。
5. 不允许只有纯文本列表，必须具备状态墙视觉。

---

## 11.6 Event Ticker 事件流

### 页面目标

像办公室实时广播一样展示 agent 工作事件。

### 示例事件

```txt
[10:01] Codex Seat 1 assigned to task: Fix mobile hero
[10:02] Reading repository
[10:03] Planning changes
[10:05] Editing app/page.tsx
[10:08] Running build
[10:09] Build failed
[10:11] Fixing TypeScript error
[10:13] Waiting for review
```

### 要求

1. 使用 mock data。
2. 有时间、工位、事件内容。
3. 具备实时感。
4. 可以滚动或按时间排序。
5. 不需要真实 WebSocket。

---

## 11.7 Review Room 审查室

### 页面目标

展示某个任务的验收界面。

PRD 1.0 不接真实 diff，只做 UI 占位。

### 必须展示

1. 任务标题
2. 所属项目
3. 当前工位
4. 任务摘要
5. 验收标准
6. 禁止事项
7. Mock 改动文件列表
8. Mock diff summary
9. Mock quality gate
10. Approve 按钮
11. Reject 按钮
12. Ask Revision 按钮

### Mock 改动文件示例

```txt
app/page.tsx                 modified
components/Hero.tsx          modified
components/MobileNav.tsx     modified
lib/site.ts                  unchanged
```

### Mock diff summary 示例

```txt
Files changed: 3
Additions: 124
Deletions: 37
Forbidden scope touched: No
```

### 按钮行为

PRD 1.0 中，按钮只改变前端 mock 状态：

- Approve：任务状态变为 done
- Reject：任务状态变为 blocked 或 rejected
- Ask Revision：任务状态变为 ready 或 running

不执行真实命令。

---

## 12. 视觉设计要求

### 12.1 总体风格

目标风格：

```txt
深色工程指挥中心
+ 轻像素办公室
+ 等距 2D 空间
+ 清晰的信息密度
```

关键词：

```txt
Command Center
Pixel Office
Agent Workspace
Engineering Review Room
Status Wall
Local-first Tool
```

### 12.2 不要做成

禁止风格：

```txt
幼稚儿童游戏
纯 Notion 看板
纯企业后台
复杂 3D 办公室
花哨但没信息价值的 UI
普通 Admin Template
```

### 12.3 UI 判断标准

必须做到：

1. 一眼能看出哪个项目在运行。
2. 一眼能看出哪个 Codex 工位在忙。
3. 一眼能看出哪个任务阻塞。
4. 一眼能看出哪个任务等待验收。
5. 一眼能看出哪些检查失败。
6. 一眼能进入 Review Room。
7. 视觉上像办公室，不像普通 dashboard。

---

## 13. 技术栈

### 13.1 PRD 1.0 技术栈

推荐：

```txt
Next.js
React
TypeScript
Tailwind CSS
Framer Motion
Zustand
Mock Data
```

Zustand 可选。  
如果本阶段状态简单，可以只使用 React state。

### 13.2 本阶段不需要

```txt
SQLite
Node local daemon
Codex CLI wrapper
Git watcher
Supabase
GitHub App
Vercel webhook
Auth
Payment
MCP Server
```

---

## 14. 推荐目录结构

```txt
codex-visual-office/
├── app/
│   ├── page.tsx
│   ├── projects/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── review/
│   │   └── [taskId]/
│   │       └── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── office/
│   │   ├── OfficeMap.tsx
│   │   ├── ProjectRoomCard.tsx
│   │   ├── AgentSeat.tsx
│   │   ├── BuildWall.tsx
│   │   └── EventTicker.tsx
│   │
│   ├── tasks/
│   │   ├── TaskCard.tsx
│   │   ├── TaskBoard.tsx
│   │   └── TaskStatusBadge.tsx
│   │
│   ├── review/
│   │   ├── ReviewPanel.tsx
│   │   ├── MockDiffSummary.tsx
│   │   └── QualityGatePanel.tsx
│   │
│   └── layout/
│       ├── AppShell.tsx
│       ├── Sidebar.tsx
│       └── TopBar.tsx
│
├── lib/
│   ├── mock-data.ts
│   ├── types.ts
│   └── status.ts
│
├── docs/
│   ├── PRD.md
│   ├── ROADMAP.md
│   └── SCOPE_LOCK.md
│
└── package.json
```

---

## 15. 数据类型定义

### 15.1 Project

```ts
export type Project = {
  id: string;
  name: string;
  description: string;
  phase: string;
  status: "active" | "paused" | "archived";
  localPath?: string;
  activeTaskIds: string[];
  assignedSeatIds: string[];
};
```

### 15.2 AgentSeat

```ts
export type AgentSeat = {
  id: string;
  name: string;
  agentType: "codex" | "chatgpt" | "human";
  status:
    | "idle"
    | "reading_repo"
    | "planning"
    | "editing"
    | "running_checks"
    | "build_failed"
    | "fixing"
    | "waiting_review"
    | "done"
    | "blocked";
  currentTaskId?: string;
  currentProjectId?: string;
};
```

### 15.3 Task

```ts
export type Task = {
  id: string;
  projectId: string;
  title: string;
  summary: string;
  status:
    | "backlog"
    | "ready"
    | "running"
    | "waiting_review"
    | "blocked"
    | "done";
  priority: "low" | "medium" | "high" | "critical";
  assignedSeatId?: string;
  acceptanceCriteria: string[];
  forbiddenScope: string[];
  createdAt: string;
  updatedAt: string;
};
```

### 15.4 BuildCheck

```ts
export type BuildCheck = {
  id: string;
  projectId: string;
  taskId?: string;
  name:
    | "typecheck"
    | "build"
    | "lint"
    | "unit_test"
    | "git_diff_check"
    | "preview";
  status: "pending" | "running" | "passed" | "failed" | "skipped";
  message?: string;
};
```

### 15.5 TaskEvent

```ts
export type TaskEvent = {
  id: string;
  taskId: string;
  projectId: string;
  seatId?: string;
  timestamp: string;
  type:
    | "task_created"
    | "task_assigned"
    | "status_changed"
    | "repo_reading"
    | "planning"
    | "editing"
    | "check_running"
    | "check_failed"
    | "waiting_review"
    | "approved"
    | "rejected"
    | "blocked";
  message: string;
};
```

### 15.6 ReviewRecord

```ts
export type ReviewRecord = {
  id: string;
  taskId: string;
  decision: "approved" | "rejected" | "revision_requested";
  notes?: string;
  createdAt: string;
};
```

---

## 16. Mock Data 要求

`lib/mock-data.ts` 必须至少包含：

1. 5 个 projects
2. 3 个 agent seats
3. 8 个 tasks
4. 12 个 task events
5. 8 个 build checks
6. 3 个 mock diff summaries

### 16.1 项目示例

```txt
Tuohang Main Site
Provider Workspace
Sanyang Temple Portal
AI Concierge
Content Engine
```

### 16.2 工位示例

```txt
Codex Seat 1
Codex Seat 2
Codex Seat 3
```

### 16.3 任务示例

```txt
Fix homepage mobile hero spacing
Build Review Room mock UI
Create local task schema draft
Improve project room layout
Design Codex seat state animation
Add Build Wall component
Prepare Phase 2 local task plan
Refine visual hierarchy
```

---

## 17. 组件要求

### 17.1 OfficeMap

用途：展示总办公室布局。

要求：

- 显示项目房间
- 显示 Codex 工位
- 显示状态灯
- 视觉上要有办公室空间感
- 点击项目房间可跳转

### 17.2 ProjectRoomCard

用途：展示项目房间卡片。

要求：

- 项目名
- 当前阶段
- 状态
- 当前任务数
- 绑定工位
- 最近构建状态

### 17.3 AgentSeat

用途：展示 Codex 工位。

要求：

- 工位名
- agent 类型
- 当前状态
- 当前项目
- 当前任务
- 状态颜色 / 状态图标 / 状态动画

### 17.4 TaskBoard

用途：按状态分组展示任务。

要求：

- Backlog
- Ready
- Running
- Waiting Review
- Blocked
- Done

### 17.5 TaskCard

用途：展示单个任务。

要求：

- 标题
- 项目
- 状态
- 优先级
- 工位
- 验收标准摘要
- 禁止事项摘要
- 点击进入 Review Room

### 17.6 BuildWall

用途：展示构建检查状态。

要求：

- 多个检查项
- 明确 passed / failed / running / pending 状态
- 不要纯文本列表

### 17.7 EventTicker

用途：展示实时事件流。

要求：

- 时间
- 工位
- 事件
- 可滚动
- 有实时广播感

### 17.8 ReviewPanel

用途：展示任务审查详情。

要求：

- 任务详情
- 验收标准
- 禁止事项
- mock diff summary
- quality gate
- 操作按钮

### 17.9 QualityGatePanel

用途：展示质量门检查项。

要求：

- typecheck
- build
- lint
- unit test
- git diff check
- preview

### 17.10 MockDiffSummary

用途：展示 mock 改动摘要。

要求：

- 文件列表
- changed / modified / added / deleted
- additions
- deletions
- forbidden scope touched

---

## 18. 状态系统

### 18.1 Agent 状态

```txt
idle
reading_repo
planning
editing
running_checks
build_failed
fixing
waiting_review
done
blocked
```

### 18.2 Task 状态

```txt
backlog
ready
running
waiting_review
blocked
done
```

### 18.3 Build 状态

```txt
pending
running
passed
failed
skipped
```

### 18.4 Review 状态

```txt
not_reviewed
approved
rejected
revision_requested
```

---

## 19. PRD 1.0 验收标准

Codex 完成后，必须满足以下验收标准：

### 19.1 基础运行

1. 应用可以正常安装依赖。
2. 应用可以正常启动。
3. `npm run build` 通过。
4. TypeScript 没有类型错误。
5. 页面没有明显 runtime error。

### 19.2 页面完整

1. `/` Office Home 可访问。
2. `/projects/[id]` Project Room 可访问。
3. `/review/[taskId]` Review Room 可访问。

### 19.3 数据完整

1. 至少 5 个 mock projects。
2. 至少 3 个 mock agent seats。
3. 至少 8 个 mock tasks。
4. 至少 12 个 mock events。
5. 至少 8 个 mock build checks。

### 19.4 UI 完整

1. 首页不是普通 dashboard，而是办公室视觉。
2. 有项目房间。
3. 有 Codex 工位。
4. 有任务看板。
5. 有构建状态墙。
6. 有事件流。
7. 有审查室。
8. 状态视觉清晰。
9. 阻塞、失败、等待验收状态明显。

### 19.5 交互完整

1. 点击项目房间能进入项目详情。
2. 点击任务能进入 Review Room。
3. Review Room 里 Approve / Reject / Ask Revision 能改变 mock 状态。
4. 页面之间导航清晰。

### 19.6 边界正确

必须确认没有做：

1. 没有调用 OpenAI API。
2. 没有接入 Codex CLI。
3. 没有读取本地文件。
4. 没有执行真实 terminal 命令。
5. 没有接 GitHub。
6. 没有接 Vercel。
7. 没有接 Supabase。
8. 没有登录注册。
9. 没有云同步。
10. 没有付款系统。

---

## 20. 开发完成后用户会得到什么

PRD 1.0 做完后，用户会得到：

1. 一个本地可运行的 Next.js 项目。
2. 一个视觉化 Codex 办公室首页。
3. 多个 mock 项目房间。
4. 多个 mock Codex 工位。
5. 一个 mock 任务看板。
6. 一个 mock 构建状态墙。
7. 一个 mock 事件流。
8. 一个 mock 审查室。
9. 一套清晰的 TypeScript 类型定义。
10. 一套清晰的组件结构。
11. 一套后续 Phase 2 / Phase 3 可继续扩展的前端基础。

用户暂时不会得到：

1. 真实 Codex CLI 调用。
2. 真实 Git diff。
3. 真实本地文件监听。
4. 真实质量门运行。
5. 真实 GitHub / Vercel / Supabase 集成。
6. 团队协作。
7. ChatGPT 内嵌 App。

---

## 21. 后续路线图

### Phase 1：视觉原型

当前阶段。

目标：

```txt
完成 mock data 驱动的 Codex Visual Office 前端原型。
```

### Phase 2：本地任务系统

目标：

```txt
用 SQLite 保存项目、任务、工位、事件。
关闭重开后数据不丢。
```

新增：

- SQLite
- 本地项目创建
- 任务创建
- 工位分配
- 事件保存

### Phase 3：本地 Codex CLI 接入

目标：

```txt
允许用户把任务派发给本地 Codex CLI。
显示 Codex 执行输出。
```

新增：

- Codex CLI 检测
- Codex Runner
- Terminal output
- Task event logging

### Phase 4：Git / 文件监听

目标：

```txt
显示 Codex 改了哪些文件。
```

新增：

- git status
- git diff summary
- file watcher
- changed files
- additions / deletions

### Phase 5：质量门 / 验收室

目标：

```txt
运行 typecheck、build、lint、git diff --check。
支持真实验收。
```

新增：

- quality command runner
- command logs
- approve / reject / revise
- review records

### Phase 6：本地可用版

目标：

```txt
让个人用户可以长期使用。
```

新增：

- 设置页
- 本地备份
- 数据导入导出
- 日志清理
- 错误恢复

### Phase 7：云同步

目标：

```txt
可选接入 GitHub、Vercel、Supabase。
```

新增：

- GitHub PR sync
- Vercel preview sync
- Supabase cloud sync
- workspace sync

### Phase 8：团队版

目标：

```txt
支持小团队协作。
```

新增：

- Workspace
- Members
- Roles
- Permissions
- Audit log

### Phase 9：ChatGPT App / MCP

目标：

```txt
让 ChatGPT 可以查看和操作办公室状态。
```

新增：

- MCP Server
- ChatGPT UI component
- Project status query
- Task dispatch interface

### Phase 10：商业化完整版

目标：

```txt
形成可销售产品。
```

新增：

- Free / Pro / Team / Enterprise plans
- Self-hosting
- Organization management
- Advanced audit
- Plugin system

---

## 22. Codex 开发指令摘要

Codex 第一轮开发必须只做 Phase 1。

### 任务目标

Build Phase 1 only.

Create a Next.js + TypeScript + Tailwind app for Codex Visual Office.

The app should be a local-first visual office prototype for ChatGPT + Codex workflows.

Use mock data only.

### 禁止事项

Do not integrate Codex CLI.  
Do not integrate OpenAI API.  
Do not integrate GitHub.  
Do not integrate Vercel.  
Do not integrate Supabase.  
Do not add authentication.  
Do not add payment.  
Do not add cloud sync.  
Do not create backend services.  

### 必须页面

1. Office Home
2. Project Room
3. Review Room

### 必须组件

1. OfficeMap
2. ProjectRoomCard
3. AgentSeat
4. TaskBoard
5. TaskCard
6. BuildWall
7. EventTicker
8. ReviewPanel
9. QualityGatePanel
10. MockDiffSummary

### UI 方向

Dark engineering command center mixed with a 2D / isometric AI office.

The product must not look like a generic admin dashboard.

---

## 23. AGENTS.md 建议内容

项目根目录应创建 `AGENTS.md`：

```md
# AGENTS.md

## Project

Codex Visual Office is a local-first visual office for ChatGPT + Codex workflows.

## Current Phase

Phase 1: Visual prototype with mock data only.

## Hard Rules

- Do not call OpenAI API.
- Do not integrate Codex CLI yet.
- Do not integrate GitHub.
- Do not integrate Vercel.
- Do not integrate Supabase.
- Do not add authentication.
- Do not add payment.
- Do not add cloud sync.
- Do not create backend services.
- Use mock data only.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- React
- Framer Motion if useful
- Zustand only if needed

## UI Direction

Dark engineering command center + 2D / isometric office.

The product must not look like a generic admin dashboard.

## Required Output

- Working app
- Clean component structure
- Strong TypeScript types
- Mock data
- Office Home
- Project Room
- Review Room
```

---

## 24. 成功定义

PRD 1.0 成功，不是因为它功能多。  
PRD 1.0 成功的标准只有一个：

> 打开页面后，用户立刻觉得：这就是 Codex 的可视化办公室。

第二标准：

> 用户能清楚看懂项目、工位、任务、状态、构建、审查之间的关系。

第三标准：

> 后续接入 Codex CLI、Git、SQLite 时，现有结构不需要推倒重来。

---

## 25. 结论

PRD 1.0 的目标是建立产品骨架，不是做完整系统。

本阶段交付的是：

> 一个本地运行的、带完整视觉结构和 mock 工作流的 Codex 可视化办公室前端 MVP。

本阶段不应该追求真实自动化。  
真实自动化从 Phase 2 / Phase 3 开始。

当前最重要的是：

1. 视觉是否成立。
2. 结构是否清楚。
3. 状态是否可读。
4. 未来是否可扩展。
5. 是否严格避免过早接入云服务和 API。
