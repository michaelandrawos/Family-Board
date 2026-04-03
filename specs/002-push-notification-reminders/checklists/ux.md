# Requirements Quality Checklist: Push Notification Reminders

**Feature**: 002-push-notification-reminders
**Date**: 2026-04-03
**Spec**: [spec.md](../spec.md)

## Category 1: User Stories

- [x] US-1 has a clear persona, action, and benefit
- [x] US-2 has a clear persona, action, and benefit
- [x] US-3 has a clear persona, action, and benefit
- [x] Each user story has a defined priority (P1/P2/P3)
- [x] Each user story is independently testable
- [x] No user story depends on another being complete first
- [x] Acceptance scenarios are concrete and measurable

## Category 2: Functional Requirements

- [x] FR-001 (permission request) is verifiable — browser API state is observable
- [x] FR-002 (notification delivery) is verifiable — notification can be observed on device
- [x] FR-003 (offset picker in add + edit) is verifiable — UI presence can be checked
- [x] FR-004 (default 15 min) is verifiable — inspect task.reminder on creation
- [x] FR-005 (cancel on delete/time change) is verifiable — no ghost fires after delete
- [x] FR-006 (denied banner) is verifiable — banner element visibility
- [x] FR-007 (task name + time in body) is verifiable — notification content inspectable
- [x] FR-008 (tap opens calendar) is verifiable — URL query param behavior observable
- [x] All FRs use MUST / SHOULD language correctly
- [x] No FR is ambiguous — each has a single clear interpretation

## Category 3: Constitution Compliance

- [x] I. Single-File — SW inlined as string, registered via Blob URL; no new files
- [x] II. Mobile-First — reminder picker ≥ 44px tap targets; reuses existing select style
- [x] III. Shared State — `data.tasks[i].reminder` synced via JSONBin; SW scheduling is device-local by design
- [x] IV. Vanilla JS — only Web Notifications API and Service Worker (browser-native)
- [x] V. Family Simplicity — default pre-selected; ≤ 2 extra taps to set reminder

## Category 4: Edge Cases

- [x] Device in Do Not Disturb — documented (OS handles queuing, app cannot override)
- [x] Device offline when task time passes — documented (recalculated on reconnect)
- [x] Task deleted after notification scheduled — FR-005 covers cancellation
- [x] App running as browser tab (non-PWA) — assumption documented; tooltip mentioned
- [x] Task has no time — reminder option hidden; `reminder` treated as null (validation rule)
- [x] Task created before feature ships (no `id`) — data-model.md backfill rule covers this

## Category 5: Data Model

- [x] Task `reminder` field has valid values enumerated (null, 0, 15, 30, 60)
- [x] Task `id` field backfill strategy defined
- [x] `swReg` runtime var purpose documented
- [x] `notifPermAsked` localStorage key documented
- [x] SW message protocol SCHEDULE schema complete
- [x] SW message protocol CANCEL schema complete
- [x] Notification click URL format documented

## Category 6: Success Criteria

- [x] SC-001 is measurable (≤ 60 seconds, testable with stopwatch)
- [x] SC-002 is measurable (delete → wait → no notification)
- [x] SC-003 is measurable (tap count observable)
- [x] SC-004 is measurable (permission check via `Notification.permission`)

## Category 7: Assumptions

- [x] PWA requirement documented
- [x] iOS 16.4+ requirement documented
- [x] Device-local scheduling (no server push) documented
- [x] Fixed snooze duration (10 min v1) documented
- [x] Reminder stored in shared JSONBin state documented

## Category 8: Plan Feasibility

- [x] All new functions listed with clear purpose
- [x] SW Blob URL approach is implementable without build tools
- [x] `postMessage` + `setTimeout` inside SW is a valid cross-browser approach
- [x] Tag-based cancellation via `reg.getNotifications({tag})` is well-supported
- [x] All changes confined to `index.html`

**Result**: 42/42 items pass. Feature is ready for task breakdown and implementation.
