<!-- Sync Impact Report
  Version change: 1.0.1 → 1.0.2
  Modified sections: Principle III — `chores` removed from data shape; Chores screen removed from app
  Added sections: none
  Removed sections: none
  Templates requiring updates:
    ✅ .specify/templates/plan-template.md — Constitution Check III already covers "No new storage keys"; no update needed
  Follow-up TODOs: none
-->

# Family Board Constitution

## Core Principles

### I. Single-File Architecture (NON-NEGOTIABLE)

The entire application MUST remain a single `index.html` file containing all HTML, CSS, and
JavaScript inline. No build tools, bundlers, transpilers, or package managers are permitted.
No external JavaScript frameworks (React, Vue, etc.) may be introduced.

**Rationale**: The app is deployed by simply uploading one file to GitHub Pages or any static
host. Zero install friction for both developers and users is a core design goal.

### II. Mobile-First, Touch-Friendly UI

All UI MUST be designed for a 430px-wide mobile viewport as the primary target. Requirements:
- Touch targets MUST be ≥ 44px in height
- Safe-area insets (env(safe-area-inset-*)) MUST be respected for iOS notch/home bar
- Interactions MUST NOT rely solely on hover states
- Desktop experience is a bonus, never the baseline

**Rationale**: The app runs as a PWA on the family's phones. Tablet/desktop layout is
acceptable but must never degrade the mobile experience.

### III. Centralized Shared State via JSONBin

All persistent data MUST live in a single `data` object with the shape:
`{ items, tasks, todos, transactions, fixed }`. This rule applies to **every screen
and feature** in the app. Every mutation — regardless of which screen triggers it — MUST:
1. Update `data` in memory
2. Call `saveLocal()` to persist to `localStorage` (key: `fb_v4`)
3. Call `push()` to sync to the shared JSONBin.io bin

No feature may introduce a second storage key, a separate API, or a side-channel data store.

**Rationale**: Both users (the owner and Marise) read from and write to the same bin. A single
source of truth prevents conflicts and simplifies the sync model.

### IV. Vanilla JS — No External Runtime Dependencies

JavaScript MUST be plain ES6+ with no imports, no npm, and no CDN-loaded frameworks.
Google Fonts (CSS only) is the sole permitted external resource.

All utility logic (date formatting, escaping, rendering) MUST be implemented as small,
named functions directly in the `<script>` block.

**Rationale**: Keeping zero runtime dependencies means the app works offline after first
load, has no supply-chain risk, and requires no toolchain to maintain.

### V. Family-Oriented Simplicity

Every feature MUST be immediately operable by a non-technical family member with no
instructions. Specifically:
- No login screen or account creation flow
- Labels, buttons, and empty states MUST use plain language (no technical jargon)
- Adding an item/task/transaction MUST require ≤ 3 taps from the home screen
- Error states MUST surface a human-readable message, never a raw error object

**Rationale**: The app's value is frictionless daily use by the whole family. Complexity
introduced for developer convenience that increases user friction is a defect.

## Tech Constraints

- **Language**: Vanilla HTML5 / CSS3 / ES6+ JavaScript — no transpilation
- **Storage**: `localStorage` (offline) + JSONBin.io REST API (shared sync)
- **Fonts**: Nunito via Google Fonts (single `<link>` in `<head>`)
- **Target**: iOS Safari (PWA) primary; Chrome Android secondary; desktop browsers tertiary
- **File budget**: `index.html` SHOULD stay under 1,500 lines; justify any growth beyond that
- **No new screens** may be added without updating the home feature grid and `openScreen()`
  routing function

## Development Workflow

- All changes MUST be made directly in `index.html` — no separate files
- New features MUST follow the existing pattern: CSS in `<style>`, HTML in `<body>`,
  JS in the `<script>` block, data in the `data` object
- A spec (`/speckit-specify`) and plan (`/speckit-plan`) MUST be created before implementing
  any new screen or significant feature
- Tasks MUST be tracked via `/speckit-tasks` before implementation begins
- Every data-mutating function MUST end with a `push()` call unless it is a read-only render

## Governance

This constitution supersedes all other development practices for the Family Board project.
Amendments require:
1. A documented rationale (why the principle needs changing)
2. A version bump following semantic versioning (MAJOR/MINOR/PATCH)
3. An update to dependent templates if the amendment affects task categorization or plan gates

The `fb_v4` localStorage schema MUST NOT be changed in a breaking way without a migration
path that reads and converts `fb_v4` data on first load.

All pull requests and changes must be verified against the Constitution Check in plan.md
before implementation.

**Version**: 1.0.2 | **Ratified**: 2026-04-03 | **Last Amended**: 2026-04-03
