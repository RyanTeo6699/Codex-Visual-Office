# Distribution Option Matrix

This matrix compares possible delivery paths after the Production 1.0 local-first baseline. It is a planning artifact only.

| Option | Description | Current readiness | Security impact | User friction | Engineering cost | Distribution risk | Recommended timing | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Source checkout + npm scripts | User clones or downloads source, installs dependencies, and runs local scripts. | ready | Low if user trusts source and local machine. | High: requires Node, package install, terminal usage, and local setup. | Low | Medium | Available now for technical users | Best current baseline delivery model. No public commercial packaging claim. |
| Browser-only local launcher | User runs local app and opens browser through the existing launcher workflow. | beta-ready | Low: local-only, no cloud, no updater. | Medium: still requires local runtime setup. | Low | Medium | Keep as fallback for all beta routes | Browser launcher fallback remains important even if desktop shell improves. |
| Unsigned Mac-first Tauri beta | Provide a Mac-first beta app artifact without signing or notarization. | needs-planning | Medium: trust warnings and manual install friction. | Medium-high: macOS Gatekeeper warnings likely. | Medium | High | Possible Phase 19 if GM chooses private beta validation | Not a public production installer. Requires explicit unsigned beta disclaimer. |
| Signed/notarized Mac package | macOS app signed with Apple Developer certificate and notarized. | not-ready | Lower trust friction if implemented correctly. | Lower after setup. | High | Medium-high | Future dedicated signing/notarization phase | Not implemented. Requires Apple Developer account, certs, hardened runtime, artifact verification. |
| Windows/Linux package | Native distribution for Windows/Linux. | not-ready | Platform-specific signing and trust model varies. | Medium | High | High | After Mac path is proven | Not implemented. Needs separate platform packaging strategy. |
| Self-hosted delivery package | Structured source bundle plus install guide, DB init, launcher, backup/safety docs. | needs-planning | Low-medium, depending on hosting and checksum process. | Medium | Medium | Medium | Good Phase 19/20 candidate | Planning only. Does not include signed installer or cloud sync. |
| Commercial package | Paid local product, self-hosted package, or enterprise internal tool. | not-ready | Requires license, privacy, support, update, and legal controls. | Medium | High | High | After beta feedback and support policy | Planning only. No payment, auth, license enforcement, or SaaS backend. |
| Cloud/team SaaS path | Hosted/team edition with accounts, sync, roles, and shared workspace. | not-ready | High: auth, data security, privacy, infra. | Lower for team use after launch. | Very high | Very high | Separate future scope lock only | Not implemented. Cloud sync and team workspace remain forbidden. |
| MCP / ChatGPT App path | Integrate as MCP server or ChatGPT App surface. | not-ready | High: platform integration, permissions, data boundary. | Medium | High | High | Separate future scope lock only | Not implemented. MCP / ChatGPT App remains forbidden. |

## Explicit Non-Implementation Notes

- Signed/notarized Mac package: not implemented.
- Auto updater: not implemented.
- Cloud/team SaaS: not implemented.
- MCP / ChatGPT App: not implemented.
- Commercial package: planning only.
