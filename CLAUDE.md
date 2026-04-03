# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture: Single-File PWA

**The entire app is `index.html`.** All HTML, CSS, and JavaScript are inline in one file — no build tools, no bundler, no framework, no separate `.css` or `.js` files. This is non-negotiable per the project constitution.

- `index.html` — the whole app (~1,500 line target; justify growth beyond that)
- `sw.js` — service worker for push notifications (scheduled via `postMessage`)

`node_modules/` exists only for dev utilities (`qrcode`, `qrcode-terminal`) used outside the app itself — they are **not** bundled into `index.html`.

## Running the App

Open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python -m http.server
```

No build step. No compile step. Deploy by uploading `index.html` to GitHub Pages or any static host.

## Data Architecture

All app state lives in a single global `data` object:

```js
data = { items, tasks, todos, transactions, fixed, chores }
```

**Every mutation must follow this pattern:**
1. Mutate `data` in memory
2. Call `saveLocal()` — persists to `localStorage` key `fb_v4`
3. Call `push()` — syncs to shared JSONBin.io REST API

The `fb_v4` localStorage schema must not change in a breaking way without a migration path.

Sync: `fetchRemote()` polls JSONBin every 8 seconds. `push()` writes back. The `apiKey` and `binId` are stored in `localStorage` and configured via the in-app setup card.

## Screens & Navigation

Five screens, all `<div class="screen" id="screen-*">` toggled via `.active` class:

| Screen ID | Feature |
|---|---|
| `screen-home` | Dashboard, today summary, sync status |
| `screen-shop` | Shopping list (per-store filter) |
| `screen-cal` | Calendar with tasks/events and reminders |
| `screen-budget` | Transactions + fixed expenses + category breakdown |
| `screen-chores` | Chore tracker (per-assignee filter) |

Navigation: `openScreen(name)` activates a screen and triggers its render function. `goHome()` returns to the home screen. Adding a new screen requires updating both the home feature grid and `openScreen()`.

## Code Conventions

- All JS is in a single `<script>` block at the bottom of `<body>`; all CSS is in a single `<style>` block in `<head>`
- Data-mutating functions end with `push()` unless read-only
- Every render function is named `render*()` (e.g., `renderShop()`, `renderCal()`, `renderChores()`)
- `renderCurrentScreen()` re-renders whichever screen is currently active — call this after a remote sync
- HTML is built via template-literal strings and set with `.innerHTML`; user content is always escaped with `esc()`
- IDs use kebab-case; JS variables use camelCase

## Notifications

Push notifications use the service worker (`sw.js`). Schedule via `scheduleNotification(task)`, cancel via `cancelNotification(taskId)`. The SW receives `SCHEDULE` / `CANCEL` postMessages and uses `setTimeout` internally. Notification permission is requested lazily.

## UI Constraints

- Mobile-first: 430px max-width, touch targets ≥ 44px
- `env(safe-area-inset-*)` used for iOS notch/home bar
- No hover-only interactions
- Font: Nunito via Google Fonts (the only permitted external resource)
- Pinch-to-zoom and double-tap zoom are blocked via JS for PWA feel

## Feature Development Process

Per the project constitution, before implementing any new screen or significant feature:
1. Create a spec with `/speckit-specify`
2. Create a plan with `/speckit-plan`
3. Track tasks with `/speckit-tasks`
4. Run a Constitution Check (see `specs/` for examples)
