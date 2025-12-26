# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Local dev

- Install: `npm ci`
- Run: `npm run dev`

## Backup & restore

### Export current

Use **Export current** in the Backup & Restore panel to download a backup file named:

`todo-backup-YYYYMMDD-HHmmss.json`

The JSON uses the canonical format:

```json
{
  "version": 1,
  "updatedAt": "2025-09-06T12:00:00.000Z",
  "todos": { "90d": [], "30d": [], "min": [] },
  "meta": { "source": "minimal-todo" }
}
```

### Import JSON

Use **Import JSON** to restore from a backup file. The app validates the schema and will show a friendly error if the file is invalid. If the backup’s `updatedAt` is older than your current state, you will be warned and asked to confirm before importing.

### Local backup history

Use **Backup now** to create a local snapshot. The app keeps the last 30 snapshots and lists them in the Backup & Restore panel with a **Restore** action.

- Primary storage: IndexedDB (`minimal-todo-backups` / `snapshots`)
- Fallback storage: localStorage (`minimal-todo:backups`, size-checked)
- Main app state: localStorage (`minimal-todo:v1`)

### Backups rail behavior

- Snapshot cap: 30 max, newest-first; oldest drops beyond 30 (enforced in storage).
- Pinned rail: max 2 pinned snapshots, fixed at the far left and never scroll away.
- Pin persistence: stored locally, separate from the snapshot JSON, keyed by snapshot id.
- Scroll rail: non-pinned snapshots only, newest at the left, initial scroll shows newest.
- Visible card rule (non-pinned only): `visibleCount = clamp(3, 8, 4 + floor((width - 980) / 300))` using the scroll-rail container width.
- Wheel behavior: when the scroll rail overflows horizontally, mouse wheel moves it sideways and prevents page scroll; otherwise the page scrolls normally.

### Restore / export / import usage

- Restore: confirm before overwriting local state, then shows a toast message.
- Export snapshot: each card exports its snapshot JSON only.
- Import JSON: validates schema, warns if `updatedAt` is older than current, and allows force import.

### Migration notes (future Supabase sync)

- The `version` and `updatedAt` fields are intended for future server sync and conflict handling.
- Backups are compatible as long as the `version` matches; if the version changes, a migration step will be required before sync.
- Snapshot schema is unchanged by this feature to keep future sync compatibility.

## GitHub Pages hosting

This repo deploys the app to GitHub Pages from the `main` branch using GitHub Actions.

- CI (PRs): builds on every PR targeting `main`
- Deploy (main): builds and publishes to GitHub Pages on every push to `main`

The Pages URL is typically `https://<owner>.github.io/<repo>/` (repo subpath required).

### Verification checklist (non-technical)

- Open the Pages URL in a private/incognito window.
- Confirm the page is not blank and the UI renders.
- Refresh the page and confirm it still works.
- Open browser devtools (Network tab) and confirm JS/CSS files are not returning 404.
- Note: data is local-only per device/browser (no cloud sync).
- Routing expectation: root-only (`/`); deep links are not guaranteed.

### Rollback

- Revert the commit that introduced the breakage and push to `main` to redeploy a known-good version.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
