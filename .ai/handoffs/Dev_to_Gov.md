Handoff: Dev_to_Gov
ID: FEATURE-002
Status: Draft
Owner: DEV
Mode: L1
Last updated: 2025-12-21
Links:
  Upstream: .ai/handoffs/PM_to_Dev.md
  Downstream: .ai/archive/FEATURE-002/gov-review.md

---

## Gate
- If PM_to_Dev status != Approved: Challenge PM_to_Dev and STOP.

## 1) Summary (≤5 bullets)
- SUM-001: Added GitHub Actions CI workflow for PR build validation on `main`.
- SUM-002: Added GitHub Actions GitHub Pages deployment workflow for pushes to `main`.
- SUM-003: Updated Vite `base` for GitHub Pages repo subpath hosting.
- SUM-004: Updated docs with local run + non-technical deployment verification checklist.

## 2) Changeset
- Files touched:
  - .github/workflows/ci.yml
  - .github/workflows/pages.yml
  - my-todo/vite.config.js
  - my-todo/README.md
- Interfaces changed (if any):
  - Vite `base` resolution — behavior

## 3) Acceptance Mapping (complete)
- AT-001: PASS — Evidence: `.github/workflows/ci.yml` triggers on `pull_request` to `main` and runs `npm run build` in `my-todo/`.
- AT-002: PASS — Evidence: `.github/workflows/ci.yml` pins Node `20.19.0` and uses `npm ci` with `my-todo/package-lock.json`.
- AT-003: PASS — Evidence: `.github/workflows/pages.yml` triggers on `push` to `main` and deploys via `actions/deploy-pages@v4` (run is linked to commit SHA in Actions UI).
- AT-004: PASS (requires GitHub-run verification) — Evidence: `.github/workflows/pages.yml` publishes `my-todo/dist` to Pages; follow VS-003 to confirm live URL renders.
- AT-005: PASS (by config) — Evidence: `my-todo/vite.config.js` sets `base` to `/<repo>/` when `GITHUB_REPOSITORY` is present (GitHub Actions), preventing asset 404s on project Pages.
- AT-006: PASS — Evidence: `my-todo/README.md` includes checklist + “local-only per device/browser” + root-only routing expectation.

## 4) Verification Steps (reproducible)
- VS-001: Open a PR targeting `main`; confirm the `CI` workflow runs and passes (or fails on a broken build).
- VS-002: Merge to `main`; confirm `Deploy to GitHub Pages` workflow succeeds and shows a `github-pages` environment with a `page_url`.
- VS-003: Open the `page_url` in an incognito/private window; confirm UI renders and refresh does not break.
- VS-004: In browser devtools Network tab, confirm JS/CSS assets load without 404.

## 5) Edge Cases & Failure Modes (FM-###)
- FM-001: GitHub Pages not enabled for “GitHub Actions” deployments — Handling: in repo Settings → Pages, set Source to “GitHub Actions” and ensure workflow permissions allow Pages.
- FM-002: Private repo restrictions (plan/visibility) prevent Pages — Handling: confirm Pages availability for the repo; otherwise deployment will fail in Actions.

## 6) Risks & Rollback Notes (high level)
- RR-001: Rollback is a revert on `main` (triggers redeploy); validate the Pages URL in an incognito window after rollback.
- RR-002: Local Windows verification may be impacted by locked `node_modules` binaries; GitHub Actions runs are the authoritative build verification.

## 7) Deviations (must be explicit)
- DEV-SCOPE-001: None.
- DEV-GOV-001: None.

## 8) Issues (optional)

---

## Challenge / Response / Approval (append-only)
