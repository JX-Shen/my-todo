Handoff: Dev_to_Gov
ID: FEATURE-002
Status: Approved
Owner: DEV
Mode: L1
Last updated: 2025-12-22
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
- AT-004: PASS (live verified) — Evidence: Pages URL successfully deployed and loads app UI in incognito window.
- AT-005: PASS (live verified) — Evidence: All JS/CSS assets load without 404 errors; app interactions functional on Pages URL.
- AT-006: PASS — Evidence: `my-todo/README.md` includes checklist + "local-only per device/browser" + root-only routing expectation.

## 4) Verification Steps (reproducible)
- VS-001: ✓ DONE: Opened PR; confirmed `CI` workflow runs and shows PASS status.
- VS-002: ✓ DONE: Merged to `main`; confirmed `Deploy to GitHub Pages` workflow succeeds with github-pages environment.
- VS-003: ✓ DONE: Opened Pages URL in incognito window; confirmed UI renders and refresh works without breakage.
- VS-004: ✓ DONE: Verified Network tab; JS/CSS assets load with 200 status (no 404s).

## 5) Edge Cases & Failure Modes (FM-###)
- FM-001: GitHub Pages not enabled for "GitHub Actions" deployments — Handling: Required repo Settings → Pages → Source: "GitHub Actions" setup (user completed).
- FM-002: Private repo restrictions (plan/visibility) prevent Pages — Handling: User made repo public to resolve; GitHub Pages now enabled.

## 6) Risks & Rollback Notes (high level)
- RR-001: Rollback is a revert on `main` (triggers redeploy); Pages automatically deploys reverted version.
- RR-002: Local Windows verification may be impacted by locked `node_modules` binaries; GitHub Actions runs are the authoritative build verification.

## 7) Deviations (must be explicit)
- DEV-SCOPE-001: None.
- DEV-GOV-001: Repo made public (user choice to avoid GitHub Pro upgrade). Documented in scope assumptions.

## 8) Issues (optional)
- None. All acceptance tests PASS with live verification.

---

## Challenge / Response / Approval (append-only)

## Approval (GOV)
Approved:
- scope: FEATURE-002 CI + GitHub Pages hosting (all S-001..S-004 delivered; all OOS items correctly out of scope)
- acceptance set: AT-001..AT-006 all PASS with live verification evidence
- drift check: PASS — no charter violations; no scope creep detected
- traceability: PASS — SC ↔ AT ↔ Evidence chain intact
Notes:
- Repo made public per GitHub Pages prerequisites; this is a supported deployment variant.
- All 4 verification steps completed successfully with live app rendering.
- No blocking issues; feature is releasable.
