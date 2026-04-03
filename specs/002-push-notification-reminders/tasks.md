# Tasks: Push Notification Reminders

**Feature**: 002-push-notification-reminders
**Branch**: `002-push-notification-reminders`
**Date**: 2026-04-03

All changes are in `index.html`. No new files.

---

## Phase 1: CSS

- [x] T-01 — Add `.reminder-row` style (flex row, hidden by default, aligns label + select, ≥ 44px tap target for select)
- [x] T-02 — Add `.notif-banner` style (amber background, full-width, small font, dismiss button)

## Phase 2: HTML — Calendar Screen

- [x] T-03 — Add `<div id="notif-banner" class="notif-banner" style="display:none;">` just below the `<div class="topbar">` inside `#screen-cal`

## Phase 3: HTML — Day Modal (add mode)

- [x] T-04 — Add reminder offset `<select id="modal-reminder">` row inside `#modal-add` after `#drum-picker-wrap`, hidden when time is off
- [x] T-05 — Populate select with options: "No reminder" (null), "At time" (0), "15 min before" (15, selected by default), "30 min before" (30), "1 hour before" (60)

## Phase 4: HTML — Edit Panel

- [x] T-06 — Add reminder offset `<select id="edit-reminder">` row inside `.edit-panel` after `.edit-time-row`, with same options as modal select
- [x] T-07 — Add `id="edit-reminder-row"` wrapper div so it can be shown/hidden based on whether a time is set

## Phase 5: JS — Service Worker constant

- [x] T-08 — Add `const SW_CODE = \`...\`` string constant containing the Service Worker source (handles SCHEDULE/CANCEL messages and notificationclick)
- [x] T-09 — Add `let swReg = null;` state variable
- [x] T-10 — Add `function registerSW()` — creates Blob URL, registers SW, stores in `swReg`; no-ops if SW not supported

## Phase 6: JS — Notification helpers

- [x] T-11 — Add `function requestNotifPermission()` — guards on `'Notification' in window`; calls `Notification.requestPermission()` if not yet asked (uses `localStorage` key `fb_notif_asked`); calls `renderPermBanner()` after
- [x] T-12 — Add `function renderPermBanner()` — shows/hides `#notif-banner` based on `Notification.permission === 'denied'`
- [x] T-13 — Add `function scheduleNotification(task)` — computes fire time from task.time minus task.reminder; posts `SCHEDULE` message to SW; no-ops if swReg null, no time, or reminder null
- [x] T-14 — Add `function cancelNotification(taskId)` — posts `CANCEL` message to SW for given tag; no-ops if swReg null

## Phase 7: JS — Task ID utilities

- [x] T-15 — Add `function genId()` — returns `Date.now().toString(36) + Math.random().toString(36).slice(2)` (reuse same pattern from chores)
- [x] T-16 — Add `function ensureTaskId(task)` — assigns `task.id = genId()` if missing; returns task.id

## Phase 8: JS — Extend existing functions

- [x] T-17 — Extend `addDayTask()` — read `#modal-reminder` value; add `id` and `reminder` to new task object; call `scheduleNotification(task)` after push
- [x] T-18 — Extend `saveEdit()` — read `#edit-reminder` value; call `cancelNotification(task.id)` before updating; update `task.reminder`; call `scheduleNotification(task)` after push
- [x] T-19 — Extend `delTask(i)` — call `cancelNotification(task.id)` before splice
- [x] T-20 — Extend `renderCal()` — call `requestNotifPermission()` on first call only; call `registerSW()` once
- [x] T-21 — Extend `startEditTask(i)` — populate `#edit-reminder` select with current task.reminder value; show/hide `#edit-reminder-row` based on whether task.time is set
- [x] T-22 — Extend `toggleTimePicker()` — show/hide `#modal-reminder-row` in sync with drum picker

## Phase 9: JS — Startup / deep link

- [x] T-23 — On app load (in `// INIT` block), read `URLSearchParams` for `?date=YYYY-MM-DD`; if present, open calendar to that date and open day modal
- [x] T-24 — On `fetchRemote` success / `loadData`, call `scheduleNotification` for all future tasks with reminder set and time not yet passed (reschedule on each app open)
