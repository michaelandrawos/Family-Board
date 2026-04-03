# Research: Push Notification Reminders

**Feature**: 002-push-notification-reminders
**Date**: 2026-04-03

## Decision: Inline Service Worker via Blob URL

**Decision**: Embed SW source code as a template literal string inside `index.html` and register it with `navigator.serviceWorker.register(URL.createObjectURL(new Blob([swCode], {type:'application/javascript'})))`.

**Rationale**: Keeps single-file architecture (Constitution Principle I). Blob URL SW registration is supported in Chrome 40+, Firefox 44+, Safari 16+. The SW origin matches the page origin, so `clients.openWindow()` works correctly.

**Caveat**: iOS Safari requires the app to be installed as a PWA (Add to Home Screen) for SW to register and for notifications to appear when the app is backgrounded. Graceful degradation: if SW registration fails, the feature shows a tooltip explaining the PWA requirement.

**Alternatives considered**:
- Separate `sw.js` file: Rejected — violates Constitution Principle I
- `setTimeout` only: Rejected — doesn't fire when app is closed; defeats core value

---

## Decision: Notification Scheduling via SW postMessage + setTimeout

**Decision**: After SW registers, `scheduleNotification(task)` posts a `{type:'SCHEDULE', tag, title, body, fireTime}` message to the SW. The SW stores a `setTimeout` for `fireTime - Date.now()` ms, then calls `self.registration.showNotification()`.

**Rationale**: SW `setTimeout` persists across page navigations within the PWA. If the device is locked, the SW timer continues. For very long timers (hours), the SW may be killed by the OS; `scheduleNotification` is also called on every `renderCal()` to re-register any missed timers.

**Alternatives considered**:
- Web Push with VAPID: Rejected — requires server infrastructure; overkill for local family app

---

## Decision: Notification Cancellation via Tag

**Decision**: Each notification uses `task.id` as its `tag`. Cancellation calls `swReg.getNotifications({tag: task.id})` and closes each returned notification. A `CANCEL` message is also posted to the SW to clear the pending `setTimeout`.

**Rationale**: Browser Notifications API supports tagging; tags allow precise targeted cancellation without tracking notification IDs separately.

---

## Decision: Reminder Offset Stored in task.reminder

**Decision**: Add `reminder` field (integer minutes or `null`) to each task object in `data.tasks`. Default for new tasks is `15`. Value of `null` means no reminder.

**Rationale**: Syncing the offset via JSONBin means both family members' devices see the same reminder setting and independently schedule the appropriate local notification.

**Alternatives considered**:
- Device-local storage: Rejected — inconsistent experience between devices; violates Principle III

---

## Decision: Permission Request Timing

**Decision**: Call `Notification.requestPermission()` on the first `renderCal()` invocation. Guard with `if(Notification.permission==='default')`. Store a flag in `localStorage` to avoid re-prompting.

**Rationale**: Permission should be requested in context (when the user opens the calendar, not on app load). SC-004 requires the prompt appears at most once.

---

## Decision: iOS / Non-PWA Graceful Degradation

**Decision**: If `('Notification' in window)` is false, or SW registration fails, show a one-time tooltip: "Install this app to your home screen to enable notification reminders."

**Rationale**: Standard browser tab on iOS does not support notifications. The tooltip educates without breaking anything.
