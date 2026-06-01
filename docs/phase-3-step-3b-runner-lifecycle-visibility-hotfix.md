# Phase 3 Step 3B Hotfix - Runner Lifecycle Visibility

## What Was Fixed

This hotfix improves scoped runner lifecycle visibility in Review Room.

Fixes:

- Runner Status block is now visible after a run.
- Runner Status can be reconstructed from persisted runner task events after page revalidation or refresh.
- Review Activity now shows more recent events so `runner_started` is not hidden by the previous four-event display limit.

## Cause

The scoped runner wrote lifecycle task events correctly, but the UI depended on client state for the result block and displayed only the first four review events. After the server action revalidated/remounted the page, the client result block could disappear, and `runner_started` could be filtered out of Review Activity.

## Behavior

Runner Status shows:

- status
- started timestamp when available
- ended timestamp when available
- exit code when available
- output preview when available
- error preview when available
- reminder that auto commit / push / deploy remain disabled

Review Activity shows up to ten recent task events.

## Boundaries

This hotfix does not add:

- Phase 3 Step 4 output streaming
- arbitrary shell runner
- terminal emulator
- `node-pty`
- Git watcher
- file watcher
- auto commit
- auto push
- auto deploy
- token reading

Phase 3 Step 4 has not started.
