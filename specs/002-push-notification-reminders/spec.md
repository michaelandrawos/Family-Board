# Feature Specification: Push Notification Reminders

**Feature Branch**: `002-push-notification-reminders`
**Created**: 2026-04-03
**Status**: Draft
**Input**: User description: "Add push notification reminders for calendar events"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enable Notifications and Receive a Reminder (Priority: P1)

A family member opens the app for the first time after this feature ships. The app asks for
permission to send notifications. The user grants permission. Later, when a calendar task's
time is approaching, a push notification appears on their phone even when the app is closed,
reminding them of the event.

**Why this priority**: Without the permission grant and the actual notification delivery,
the feature delivers no value. This is the core end-to-end flow.

**Independent Test**: Can be fully tested by granting permission, adding a task with a time
1–2 minutes in the future, locking the phone, and confirming the notification arrives.

**Acceptance Scenarios**:

1. **Given** the app is opened and notifications have not been requested yet, **When** the Notifications permission prompt appears, **Then** the user can grant or deny it.
2. **Given** a calendar task is set for 3:00 PM, **When** the clock reaches 2:45 PM (15 min before), **Then** a notification reading "Reminder: [task name] at 3:00 PM" appears on the device.
3. **Given** the user denied notification permission, **When** they visit the Calendar screen, **Then** a banner explains how to enable notifications in device settings.

---

### User Story 2 - Set a Reminder Offset per Task (Priority: P2)

When adding or editing a calendar task, the user can choose how far in advance they want
a reminder: e.g. at time, 15 min before, 30 min before, 1 hour before. The default is
15 minutes before.

**Why this priority**: Reminder offset personalises the feature and makes it practical —
a rigid 15-minute rule suits some events but not others (school run vs. a dentist appointment).

**Independent Test**: Can be fully tested by adding two tasks with different reminder offsets
and confirming each notification fires at the correct relative time.

**Acceptance Scenarios**:

1. **Given** a task is added with "30 min before" selected, **When** the scheduled time minus 30 minutes arrives, **Then** the notification fires.
2. **Given** a task with no time set, **When** viewing the reminder options, **Then** the reminder offset picker is hidden or disabled.
3. **Given** a task is edited and the reminder offset changed, **When** the edit is saved, **Then** the previously scheduled notification is cancelled and a new one is scheduled with the updated offset.

---

### User Story 3 - Dismiss or Snooze a Notification (Priority: P3)

The user can dismiss a notification (marks it as seen) or snooze it (re-fires after 10 minutes).

**Why this priority**: Useful for usability but not critical — the core value is the notification
arriving, not how it is dismissed.

**Independent Test**: Can be tested by triggering a notification, snoozing it, and confirming
it reappears after 10 minutes.

**Acceptance Scenarios**:

1. **Given** a notification has arrived, **When** the user swipes it away, **Then** it is dismissed and does not reappear.
2. **Given** a notification has arrived, **When** the user taps "Snooze", **Then** a new notification fires 10 minutes later.
3. **Given** the app is opened from a notification tap, **Then** the Calendar screen opens directly to the relevant date.

---

### Edge Cases

- What if the device is in Do Not Disturb mode? The notification is queued by the OS; the app cannot override this.
- What if the task time passes while the device is offline? The notification fires as soon as the device reconnects and the scheduled time is recalculated.
- What if a task is deleted after its notification has been scheduled? The scheduled notification MUST be cancelled.
- What if the app is not installed as a PWA (running as a regular browser tab)? Notifications will only work if the browser tab is open; a tooltip explains this limitation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST request notification permission from the user on first use of the Calendar screen.
- **FR-002**: Users MUST receive a push notification at the scheduled reminder time for each calendar task that has a time set.
- **FR-003**: Users MUST be able to select a reminder offset per task (at time / 15 min / 30 min / 1 hour before) in both the add-task modal and the edit panel.
- **FR-004**: The default reminder offset for new tasks MUST be 15 minutes before.
- **FR-005**: When a task is deleted or its time is changed, any previously scheduled notification for that task MUST be cancelled.
- **FR-006**: Users who denied permission MUST see a prompt explaining how to re-enable notifications in device settings.
- **FR-007**: Notifications MUST include the task name and scheduled time in the message body.
- **FR-008**: Tapping a notification MUST open the app to the Calendar screen on the relevant date.

### Key Entities

- **Task** (extended): existing entity in `data.tasks`, extended with `reminder` field (number of minutes before task time; 0 = at time, 15 = 15 min before, 30, 60; null = no reminder)
- **Scheduled Reminder** (runtime only, not persisted): fire time computed client-side from task time minus reminder offset; managed by Service Worker via Blob URL

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A notification arrives within 60 seconds of the scheduled reminder time.
- **SC-002**: Deleting a task cancels its pending notification with no ghost notifications firing.
- **SC-003**: A family member can set a reminder for a new task in ≤ 2 additional taps beyond adding the task itself.
- **SC-004**: The permission request is shown at most once per device; subsequent opens do not re-prompt if already granted or denied.

## Assumptions

- The app must be installed as a PWA (added to home screen) for background notifications to work on iOS and Android.
- Notifications use the browser Web Notifications API and a Service Worker inlined via Blob URL in `index.html` — preserves Single-File Architecture (Constitution Principle I).
- Only tasks with an explicit time set are eligible for reminders; all-day / undated tasks do not trigger notifications.
- Snooze duration is fixed at 10 minutes in v1; no custom snooze duration.
- Notifications are device-local — each family member's device schedules its own reminders independently. There is no server-side push in v1.
- The reminder offset is stored as `data.tasks[i].reminder` (synced via JSONBin); both devices independently schedule their own local notifications from this shared value.
- The reminder offset picker appears in both the add-task modal and the edit panel.

## Clarifications

### Session 2026-04-03

- Q: Service Worker vs single-file constraint? → A: Inline Service Worker as a string in index.html, registered via Blob URL — single-file preserved, background delivery enabled. FR-002 and Assumptions updated.
- Q: Where is the reminder offset picker shown? → A: Both the add-task modal and the edit panel (consistent UX). FR-003 updated.
- Q: How is the reminder offset stored? → A: As `data.tasks[i].reminder` field (synced via JSONBin) — both devices see same offset and independently schedule local notifications. FR-003 and Key Entities updated.
