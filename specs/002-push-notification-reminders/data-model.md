# Data Model: Push Notification Reminders

**Feature**: 002-push-notification-reminders
**Date**: 2026-04-03

## Entity: Task (extended)

The existing `data.tasks` array items are extended with one new optional field.

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | Yes | (existing) Task name |
| `date` | string | Yes | (existing) ISO date YYYY-MM-DD |
| `time` | string | No | (existing) HH:MM 24h time |
| `done` | boolean | Yes | (existing) Completion state |
| `id` | string | No* | Unique ID for notification tag — added on creation if missing |
| `reminder` | number \| null | No | Minutes before task time to fire reminder (0, 15, 30, 60); `null` = no reminder; default `15` when time is set |

*`id` may not exist on tasks created before this feature ships; `scheduleNotification` must generate and backfill it.

### Validation Rules

- `reminder` is only meaningful when `time` is set; if `time` is null/empty, `reminder` MUST be treated as null
- Valid `reminder` values: `null`, `0`, `15`, `30`, `60`
- Default for new tasks with a time: `15`

### Data Shape Example

```json
{
  "tasks": [
    {
      "name": "School run",
      "date": "2026-04-04",
      "time": "08:30",
      "done": false,
      "id": "lp7k2zabc3",
      "reminder": 15
    },
    {
      "name": "Dentist",
      "date": "2026-04-05",
      "time": "14:00",
      "done": false,
      "id": "lp7k2zabc4",
      "reminder": 60
    },
    {
      "name": "Note with no time",
      "date": "2026-04-06",
      "done": false,
      "id": "lp7k2zabc5",
      "reminder": null
    }
  ]
}
```

## Runtime State (not persisted in data object)

| Variable | Type | Description |
|---|---|---|
| `swReg` | ServiceWorkerRegistration \| null | Reference to registered SW; null if not supported |
| `notifPermAsked` | boolean | localStorage flag `fb_notif_asked`; prevents re-prompting |

## Service Worker Message Protocol

Messages sent from main page to SW via `swReg.active.postMessage(msg)`:

### SCHEDULE

```json
{
  "type": "SCHEDULE",
  "tag": "lp7k2zabc3",
  "title": "Reminder: School run",
  "body": "Today at 8:30 AM",
  "fireTime": 1743754200000
}
```

### CANCEL

```json
{
  "type": "CANCEL",
  "tag": "lp7k2zabc3"
}
```

### Notification Click URL

SW opens: `self.location.origin + self.location.pathname + '?date=2026-04-04'`

Main page reads `URLSearchParams` on load and navigates to that calendar date.
