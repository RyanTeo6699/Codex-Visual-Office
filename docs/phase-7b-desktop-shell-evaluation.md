# Phase 7B - Desktop Shell Evaluation

## Final Status

EVALUATION_COMPLETE_WITH_RECOMMENDATION

## Baseline

- Baseline commit before this step: `c741c6c docs: reconcile phase 7 roadmap`
- Goal: evaluate best local desktop shell strategy before implementation.
- Scope statement: Phase 7B is evaluation/docs only; no implementation has started.
- Next recommended stage: Phase 7C Local Launcher.
- Phase 7C implementation has not started.

## Evaluation Sources

- Tauri states that it supports existing web stacks and any frontend framework, and targets cross-platform apps across Linux, macOS, Windows, Android, and iOS. Source: https://tauri.app/
- Tauri prerequisites require system dependencies and Rust for development. Source: https://v2.tauri.app/start/prerequisites/
- Electron's security guidance requires strict hardening, including avoiding Node.js integration for remote content, enabling context isolation and sandboxing, defining CSP, validating IPC senders, and avoiding unsafe API exposure. Source: https://www.electronjs.org/docs/latest/tutorial/security
- Next.js static export can produce HTML/CSS/JS static assets for any web server, but server-required features are unsupported in static export mode. Source: https://nextjs.org/docs/pages/guides/static-exports
- Next.js also supports deployment modes such as standalone and Docker-oriented output. Source: https://nextjs.org/docs/pages/getting-started/deploying

## Options Compared

1. Browser-only local launcher.
2. Tauri desktop shell.
3. Electron desktop shell.
4. Deferred packaging / continue local web app temporarily.

## Comparison Table

| Criteria | Browser-only local launcher | Tauri desktop shell | Electron desktop shell | Deferred packaging / continue local web app temporarily |
| --- | --- | --- | --- | --- |
| Local-first fit | Strong: keeps the app local and explicit, with the browser as the UI surface. | Strong long-term fit if native shell boundaries are kept narrow. | Possible, but heavier runtime and privileged bridge model raise local security burden. | Strong short-term fit, but does not improve launch ergonomics. |
| Implementation complexity | Low to medium: define startup/status flow without desktop runtime. | Medium to high: requires Rust, Tauri project structure, shell boundary design, and platform prerequisites. | Medium to high: familiar JS ecosystem, but requires main/preload process design and hardening. | Low: continue current approach and document known gaps. |
| Security surface | Smallest first step: browser surface plus explicit local process checks. | Moderate: native shell APIs must be scoped; Tauri permissions/capabilities need careful design. | Largest first step: Electron security checklist must be actively enforced across windows, IPC, CSP, sandboxing, and API exposure. | Small, but punts launcher/security boundary decisions. |
| Packaging/distribution complexity | None in Phase 7C. | Medium to high once packaging starts: platform bundles, signing, notarization, installers, and updater decisions. | High once packaging starts: bundled runtime, installers, signing, updater decisions, and security review. | None now, but creates future backlog. |
| Compatibility with current Next.js app | Strong: current local web app can remain the product surface. | Good in principle: Tauri supports existing web stacks, but Next.js static/server mode must be chosen carefully. | Good in principle: Electron can host web UI, but adds desktop process architecture. | Strong: no architecture change. |
| Local SQLite / `.local` data path handling | Strong validation path: launcher can check expected local data path without embedding it in a desktop shell yet. | Good later: Tauri can own app data paths, but should wait until launcher boundaries are proven. | Good technically, but privileged file access increases hardening work. | Existing behavior continues; no new validation affordance. |
| Codex CLI / quality gate execution boundaries | Best next step: check availability and approved project paths without creating a general shell runner. | Needs explicit command-scope design before any shell/process capability is added. | Needs strict IPC and process boundary design; easy to overexpose privileged execution. | Existing boundaries continue; no launcher-level clarity added. |
| Update strategy risk | Low: no auto updater. | Deferred: updater, signing, and release channel policy can be evaluated later. | Deferred but heavier: updater must be secured and maintained with Electron runtime updates. | Low now, higher later due to delayed packaging decisions. |
| Mac-first viability | Strong: easiest to validate on current local Mac workflow. | Strong after prerequisites: macOS is a supported Tauri development target. | Strong technically, but larger security/release footprint. | Strong but ergonomics remain manual. |
| Windows/Linux future viability | Good if launcher checks stay platform-aware and avoid Mac-only assumptions. | Strong future potential: Tauri targets Windows and Linux too, though Linux prerequisites vary. | Strong technical reach, but larger packaging/security maintenance burden. | Good only as a temporary hold; future viability remains unresolved. |

## Findings

Tauri is a credible future packaging path because it is designed for existing web stacks and cross-platform applications. Its fit with the current Next.js frontend is promising, but the development model introduces Rust and system prerequisite requirements that should not be added until the local launcher boundary is validated.

Electron is technically viable, but it is not recommended as the first packaging path for this project. The official security guidance makes clear that Electron apps need deliberate hardening around Node integration, context isolation, sandboxing, CSP, IPC sender validation, navigation/window controls, current runtime versions, and API exposure. That security surface is heavier than the current local-first need, which is mostly to open and supervise a local app workflow.

Next.js leaves two relevant paths open. A static export can serve HTML/CSS/JS from any web server, but features requiring a Node.js server are unsupported. Next.js also supports standalone/Docker-oriented deployment modes. This means Phase 7C should first clarify whether Codex Visual Office needs a local server runtime or can safely move toward static assets for packaging later.

Browser-only local launcher is the best immediate next step because it validates the product's local runtime contract without committing to desktop shell assumptions. It keeps implementation closer to the current app, avoids packaging/signing/updater work, and lets the team prove the exact checks needed for local DB paths, app URL health, Codex CLI availability, and approved project paths.

Deferred packaging alone is acceptable only as a short pause, not as the recommended path. The product needs a clearer local launch experience before a desktop shell can be evaluated responsibly.

## Recommendation

Choose Phase 7C Browser-only Local Launcher first, then pursue Phase 7D Tauri packaging prototype only after launcher boundaries are validated.

This sequence keeps the project local-first while avoiding premature desktop runtime decisions. Phase 7C should prove the local app contract: how the user opens the localhost app, how the app reports status, how local data paths are checked, and how Codex CLI / quality gate boundaries are displayed without creating arbitrary command execution.

After Phase 7C is accepted, Phase 7D can test Tauri as a packaging proof. Tauri is preferred over Electron for the first packaging prototype because it better matches the desired small local shell direction and avoids Electron's heavier initial hardening burden.

## Recommended Phase 7C Scope

- Local launcher plan/implementation.
- Open localhost app.
- Status checks for local DB path, app URL, Codex CLI availability, and approved project paths.
- No desktop runtime.
- No packaging.
- No auto updater.
- No daemon.
- No cloud sync.

## Recommended Phase 7D Scope

- Tauri proof only if Phase 7C is accepted.
- No production distribution.
- No auto updater.
- No code signing/notarization unless separately approved.

## Explicit Forbidden Items For Phase 7B

- Tauri/Electron install or implementation.
- Desktop packaging scripts.
- Auto updater.
- System tray.
- Background daemon/startup service/cron.
- Cloud sync.
- GitHub API/Vercel/Supabase.
- Auth/payment/team workspace.
- MCP/ChatGPT App.
- OpenAI API.
- Arbitrary shell runner/terminal emulator/node-pty.

## Risks And Mitigations

| Risk | Mitigation |
| --- | --- |
| Browser-only launcher may feel less native than a desktop shell. | Treat Phase 7C as boundary validation, not the final desktop experience. |
| Local launcher could accidentally become a general shell runner. | Limit it to explicit status checks and approved local paths; do not add arbitrary command execution. |
| Next.js packaging assumptions may be wrong if server features are required. | In Phase 7C, document whether the app needs Node server mode or can move toward static export. |
| Tauri may add Rust/system prerequisite friction. | Delay Tauri until Phase 7D and keep it as a proof, not production distribution. |
| Electron could be faster to prototype but widen the security surface. | Do not choose Electron first; revisit only if Tauri fails a concrete requirement. |
| Cross-platform launcher behavior may drift from Mac-first implementation. | Define status checks and paths with explicit platform abstractions before Windows/Linux work. |
| Update strategy may become entangled with packaging. | Keep auto updater forbidden through Phase 7D unless separately approved. |

## Acceptance Criteria

- Evaluation document exists at `docs/phase-7b-desktop-shell-evaluation.md`.
- Final status is `EVALUATION_COMPLETE_WITH_RECOMMENDATION`.
- Baseline commit is recorded as `c741c6c docs: reconcile phase 7 roadmap`.
- Evaluation states that Phase 7B is documentation only and no implementation started.
- Browser-only local launcher, Tauri, Electron, and deferred packaging options are compared.
- Required evaluation criteria are covered in a comparison table.
- Findings are grounded in official Tauri, Electron, and Next.js documentation.
- Recommendation clearly selects Phase 7C Browser-only Local Launcher first, then Phase 7D Tauri packaging prototype if Phase 7C is accepted.
- Electron is explicitly not recommended as the first packaging path.
- Phase 7C and Phase 7D scopes are defined.
- Phase 7B forbidden items are explicitly listed.
- Risks, mitigations, acceptance criteria, and failure criteria are documented.
- Next recommended stage is Phase 7C Local Launcher.
- The document states Phase 7C implementation has not started.

## Failure Criteria

- Any Tauri or Electron dependency is installed.
- Any desktop runtime, launcher, packaging script, updater, system tray, daemon, service, or cron job is implemented.
- Any app code, UI, package file, dependency, schema, migration, script, or config is modified.
- Any cloud sync, GitHub API, Vercel, Supabase, auth, payment, team workspace, MCP, ChatGPT App, or OpenAI API work is added.
- Any arbitrary shell runner, terminal emulator, or `node-pty` capability is added.
- Recommendation skips Phase 7C and starts packaging directly.

## Conclusion

Phase 7B is complete as an evaluation with recommendation. The recommended next stage is Phase 7C Local Launcher. Phase 7C implementation has not started.
