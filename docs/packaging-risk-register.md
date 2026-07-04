# Packaging Risk Register

| Risk | Severity | Area | Current mitigation | Remaining limitation | Release impact | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- |
| Unsigned app trust friction | High | macOS distribution | Keep browser launcher fallback and clear beta language. | Gatekeeper warnings can block non-technical users. | Limits public beta reach. | Validate private unsigned Mac beta before wider release. |
| No code signing | High | macOS trust | Documented as not implemented. | No Apple Developer certificate or signing workflow. | Blocks production installer claim. | Dedicated signing scope lock. |
| No notarization | High | macOS distribution | Documented as not implemented. | App may be quarantined or blocked. | Blocks public commercial launch. | Dedicated notarization phase after signing plan. |
| No auto updater | Medium | Release operations | Manual source/browser launcher path. | Users must update manually. | Support burden increases. | Plan update policy before commercial release. |
| Tauri beta candidate only | Medium | Desktop shell | Prototype verification exists. | Production packaging is not implemented. | Desktop claims must stay beta-only. | Continue Tauri validation or choose browser-first release. |
| Localhost dependency | Medium | Runtime | Browser launcher and local shell docs. | User environment can vary. | Setup friction. | Document supported Node/npm setup and diagnostics. |
| Browser launcher fallback dependency | Medium | Delivery | Browser launcher is verified and local-only. | Still requires local app server. | Good fallback, not polished installer. | Keep fallback until signed package exists. |
| Codex CLI prerequisite | High | Codex workflow | CLI detection and safety surfaces. | User must install Codex separately. | Beta onboarding friction. | Add prerequisite guide in future release prep. |
| Codex auth unknown | Medium | Codex workflow | Coarse runtime reliability classification. | App does not read token/auth details. | User may need manual setup troubleshooting. | Keep auth boundary; improve docs, not token access. |
| Local DB corruption | Medium | Local data | Backup/restore exists for app SQLite DB. | No automated repair or cloud replica. | Data loss risk if user ignores backups. | Add backup guidance and restore drills. |
| Backup restore user error | Medium | Local data | Dry-run and pre-restore safety backup. | User can still misunderstand backup scope. | Support burden. | Improve restore warnings and docs. |
| No cloud sync | Medium | Product scope | Explicit local-first policy. | No multi-device continuity. | Limits team adoption. | Separate cloud/team scope lock if desired. |
| No team permissions | Medium | Collaboration | Single-local-user posture. | No roles, audit, or shared workspace. | Limits company rollout. | Separate team workspace phase. |
| No telemetry | Low | Support | Manual QA and verifier scripts. | Harder to diagnose field failures. | Support burden. | Decide telemetry/privacy posture before commercial launch. |
| Support burden | High | Operations | Known limitations and release docs. | No public support policy. | Blocks commercial launch. | Define support SLA and troubleshooting guide. |
| Platform-specific packaging variability | High | Distribution | Mac-first prototype only. | Windows/Linux need separate validation. | Cross-platform release risk. | Prove one platform before broad packaging. |
