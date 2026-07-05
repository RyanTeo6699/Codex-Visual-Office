# Private Beta Tester Cohort Plan

## Ideal Tester Types

| Tester type | Why included |
| --- | --- |
| Developer familiar with local tools | Validates source checkout, npm, SQLite, and browser local workflows. |
| Codex CLI user | Evaluates Codex runtime language, status surfaces, and workflow fit. |
| Project owner / GM workflow user | Validates review, approval, and project control mental model. |
| UI/UX reviewer | Identifies visual office clarity, navigation, and responsive issues. |
| Safety-conscious tester | Reviews boundaries around local paths, tokens, commands, backup, and archive dry-run. |

## Environment Coverage

- macOS primary.
- At least two Node/npm version combinations.
- Codex CLI present.
- Codex CLI absent.
- Fresh clone setup.
- Existing clone update path.
- Desktop browser at normal width.
- Mobile-ish browser width around 390px for responsive checks.

## Exclusions

- Non-technical public users.
- Users expecting a signed installer.
- Users expecting a cloud/team product.
- Users expecting commercial support SLAs.
- Users who cannot avoid sharing secrets, tokens, private keys, `.env`, `.env.local`, or `auth.json`.

## Tester Onboarding Checklist

- Confirm tester understands this is a private beta.
- Confirm tester understands this is local-first and source-checkout based.
- Confirm tester understands there is no public release, signed/notarized installer, or auto updater.
- Confirm tester understands no cloud sync, auth/payment, team workspace, MCP, GitHub API, Vercel, Supabase, or OpenAI API integration is part of the beta.
- Provide package checklist and tester guide.
- Provide feedback template and issue report template.
- Provide support runbook boundaries.
- Confirm tester knows not to share tokens, private keys, `.env`, `.env.local`, or `auth.json`.

## Cohort Size Recommendation

Use one small balanced cohort before widening:

- 2 local developer testers.
- 1 Codex CLI user.
- 1 GM/project workflow reviewer.
- 1 UI/responsive reviewer.
- 1 safety/data boundary reviewer.

Add 2 overflow testers only if the first group does not expose setup blockers.
