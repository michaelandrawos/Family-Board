# Quickstart: Push Notification Reminders

**Feature**: 002-push-notification-reminders
**Date**: 2026-04-03

## Prerequisites

- App installed as PWA on Android (Chrome) or iOS 16.4+ (Safari — must add to Home Screen)
- Test on device, not desktop browser (SW notifications limited on desktop)

## Manual Test Scenarios

### T-001 — Permission granted on first Calendar visit

1. Clear app data / use fresh install
2. Open app → tap Calendar
3. **Expect**: Browser permission prompt appears: "Allow Family Board to send notifications?"
4. Tap **Allow**
5. Navigate away and back to Calendar
6. **Expect**: Prompt does NOT appear again (shown at most once)

---

### T-002 — Permission denied banner

1. Clear app data / use fresh install
2. Open app → tap Calendar
3. When prompt appears, tap **Deny**
4. **Expect**: Yellow banner at top of Calendar screen: "Notifications blocked. Enable them in device Settings."
5. Navigate away and back to Calendar
6. **Expect**: Banner still visible

---

### T-003 — Add task with reminder (quick fire)

1. Open Calendar → tap today's date
2. Tap **+ Add task**
3. Type "Test Reminder"
4. Enable the time toggle → set time to 1–2 minutes from now
5. **Expect**: Reminder offset row appears below the drum picker, defaulting to **15 min before**
6. Leave at 15 min before, tap **Add task +**
7. Lock screen or switch apps
8. Wait for reminder fire time (task time minus 15 minutes)
9. **Expect**: Notification arrives: "Reminder: Test Reminder" / "Today at HH:MM AM/PM"

---

### T-004 — Reminder offset — At time

1. Add task with time 3 minutes from now
2. Set reminder offset to **At time**
3. Add task, lock screen
4. **Expect**: Notification arrives at exactly the task time

---

### T-005 — Reminder offset — 30 min / 1 hr before

1. Add task with time 40 minutes from now
2. Set reminder to **30 min before**
3. Add task
4. **Expect**: Notification fires at (task time − 30 min)

---

### T-006 — Task with no time — reminder hidden

1. Open Calendar → tap a date → Add task
2. Leave time toggle OFF
3. **Expect**: Reminder offset row is hidden / not rendered

---

### T-007 — Edit changes reminder

1. Open Calendar → open a task that has a reminder scheduled
2. Tap edit (✏️) on the task
3. Change reminder offset from 15 min to 30 min
4. Tap **Save**
5. **Expect**: Old notification cancelled; new one scheduled for (task time − 30 min)

---

### T-008 — Delete task cancels notification

1. Add a task with a reminder 5 minutes from now
2. Before it fires, open the modal and tap **×** to delete the task
3. Wait past the original fire time
4. **Expect**: No notification arrives

---

### T-009 — Tap notification opens Calendar

1. Wait for a reminder notification to appear
2. Tap the notification banner
3. **Expect**: App opens to the Calendar screen on the correct date

---

### T-010 — Existing tasks load and schedule on app open

1. Add a task with a reminder via JSONBin sync from another device
2. Open the app fresh on a second device (notifications already permitted)
3. **Expect**: Notification is scheduled automatically on load for that task

---

### T-011 — No time — no ghost notification

1. Add a task without a time (time toggle OFF)
2. Wait 1 minute
3. **Expect**: No notification fires for this task
