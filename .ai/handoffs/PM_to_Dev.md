Handoff: PM_to_Dev
ID: FEATURE-002
Status: Approved
Owner: PM
Mode: L2
Last updated: 2025-12-21
Links:
  Upstream: .ai/handoffs/BA_to_PM.md
  Downstream: .ai/handoffs/Dev_to_Gov.md

---

## Gate
- If BA_to_PM status != Approved: Challenge BA_to_PM and STOP.

## 1) Scope
### In-scope (S-###)
- S-001: Add GitHub Actions CI workflow that runs on PRs to the default branch and fails on build failure.
- S-002: Add GitHub Actions deploy workflow that publishes the built site to GitHub Pages on push/merge to the default branch.
- S-003: Ensure Vite build serves correctly from the GitHub Pages URL structure (repo subpath), limited to config/hosting correctness.
- S-004: Add minimal docs for local run, deployment verification, and “local-only per device/browser” expectation.

### Out-of-scope (OOS-###) — must mirror BA Non-goals
- OOS-001: Any new end-user features (tags/views/databases/blocks), accounts/login, collaboration, or cloud sync.
- OOS-002: Non-GitHub hosting (Netlify/Vercel), PR preview deployments, custom domains, analytics/SEO, perf tuning as deliverables.
- OOS-003: Deep-link routing guarantees beyond `/` (root-only expectation for MVP hosting).

## 2) Acceptance Tests (AT-###) — MUST map to BA SC-###
- AT-001 -> SC-002: Opening a PR targeting `main` triggers CI; GitHub shows a PASS/FAIL check; a failing build results in a failing check.
- AT-002 -> SC-002: CI uses a deterministic Node environment (version pinned) and installs dependencies via lockfile-respecting install (`npm ci`), executed in `my-todo/`.
- AT-003 -> SC-003: Push/merge to `main` triggers an automated GitHub Pages deployment; the run succeeds and is associated with the triggering commit SHA.
- AT-004 -> SC-001: The GitHub Pages URL loads successfully in a clean browser session (incognito/private window) and renders the app UI (not a blank page).
- AT-005 -> SC-004: When loaded from the Pages URL (repo subpath included), JS/CSS assets load without 404s; the app remains usable after refresh.
- AT-006 -> SC-005: Docs contain a short, non-technical verification checklist and state “local-only per device/browser” + root-only routing expectation.

## 3) Deliverables (D-###)
- D-001: GitHub Actions CI workflow file(s) under `.github/workflows/` for PR validation.
- D-002: GitHub Actions Pages deploy workflow file(s) under `.github/workflows/` for default-branch publishing.
- D-003: Minimal build/hosting config changes required for GitHub Pages path correctness (e.g., Vite base path).
- D-004: Minimal documentation update with verification + rollback notes.

## 4) Milestones (max 3)
- M1: CI Gate Ready (PRs show deterministic PASS/FAIL for build).
- M2: Pages Deploy Ready (default branch deploys automatically; stable Pages URL works).
- M3: Operate + Verify Ready (checklist + rollback guidance documented).

## 5) Risks (R-###) & Mitigations
- R-001: GitHub Pages permissions/visibility prevent publish. — Mitigation: validate repo settings + workflow permissions early; document required settings in checklist.
- R-002: GitHub Pages subpath breaks assets (incorrect Vite base). — Mitigation: verify on the real Pages URL in a clean session; treat any asset 404 as release-blocking.
- R-003: CI flakiness / environment drift. — Mitigation: pin Node version; use lockfile install; keep CI steps minimal (install + build).
- R-004: Post-deploy caching makes validation confusing. — Mitigation: include “hard refresh / open incognito” in verification steps.

## 6) Dependencies + Rollout / Verification Plan
- DEP-001: Repo settings allow GitHub Pages publishing via GitHub Actions (per BA assumption A-005).
- DEP-002: Node + package manager available in GitHub Actions runner; `my-todo/package-lock.json` is present and used.
- DEP-003: Default branch is `main`.
- DEP-004: App build context is `my-todo/` (workflows must run install/build from that directory).
- DEP-005: GitHub Pages target is project pages under repo subpath (expected URL shape `/<repo>/`), per BA SC-004.
- RV-001: Enable GitHub Pages (Actions-based) for the repo; capture the resulting URL in docs.
- RV-002: Create PR to confirm CI status; merge to default; confirm Pages deploy run succeeds; open Pages URL in incognito and verify UI + no broken assets.
- RV-003: Rollback if broken: revert the offending commit (or redeploy a known-good commit) and confirm Pages deploy + URL recovery.

## 7) Issues (optional)

---

## Challenge / Response / Approval (append-only)

## Challenge (DEV)
Type: Blocking
Issues raised:
- I-001 (Blocking): `PM_to_Dev` status is not `Approved`, so DEV cannot begin implementation per AGENTS Gate rules.
- I-002 (Blocking): Required boot files referenced by the DEV runbook are missing: `.ai/decisions.yml`, `.ai/standards.md`, `.ai/INDEX.md` (currently absent in repo), so execution context is incomplete vs the requested boot sequence.
Questions:
- Q-001: Please update `PM_to_Dev` to `Approved` (or provide a Challenge/Response cycle) and confirm `BA_to_PM` is `Approved` per its own Gate.
- Q-002: Confirm default branch name and package manager expectation (`npm`/`pnpm`/`yarn`) to keep CI deterministic (AT-002).
- Q-003: Confirm where the Vite app lives (repo root vs subfolder) and expected GitHub Pages target (project pages `/<repo>/` vs user/org pages `/`), to satisfy AT-004/AT-005 without guessing.
Proposed revision:
- PR-001: Move `PM_to_Dev` to `Revised` with explicit values for Q-002/Q-003, then add an `Approval (PM)` block marking scope + acceptance set `AT-001..AT-006`.

## Response (PM)
Issue resolution:
- I-001: Resolved — `PM_to_Dev` updated to `Status: Revised` with explicit answers below; DEV should append `## Approval (DEV)` and set `Status: Approved` when ready to begin implementation (per status machine; approver is downstream).
- I-002: Resolved — AGENTS.md does not require `.ai/decisions.yml`, `.ai/standards.md`, `.ai/INDEX.md`; optional generated equivalents exist under `.ai/generated/` and are reference-only.
Answers:
- Q-001: Confirmed — `.ai/handoffs/BA_to_PM.md` is `Status: Approved`; this `PM_to_Dev` is now `Status: Revised` pending DEV approval.
- Q-002: Confirmed — default branch is `main`; package manager is `npm` (lockfile: `my-todo/package-lock.json`); workflows should run `npm ci`/`npm run build` in `my-todo/`.
- Q-003: Confirmed — Vite app lives in `my-todo/`; hosting target is GitHub Pages project site under repo subpath (URL shape `/<repo>/`), so base-path correctness is part of acceptance (AT-005).
Revision summary:
- Added explicit branch/package manager/app path + Pages target dependencies; updated AT-001..AT-003 accordingly.
Decision needed:
- DEV approval of this revised execution contract (append `## Approval (DEV)`).

## Challenge (DEV) — Gate Still Closed
Type: Blocking
Issues raised:
- I-003 (Blocking): `PM_to_Dev` is not `Status: Approved` (PM notes it is `Revised` pending DEV approval), but the DEV session Gate requires `Status: Approved` before implementation.
Questions:
- Q-004: Confirm whether DEV is authorized to set `Status: Approved` by appending `## Approval (DEV)` (as suggested in PM response), or whether PM will set `Status: Approved` via an `## Approval (PM)` block.
Proposed revision:
- PR-002: Set `Status: Approved` and add an explicit Approval block stating acceptance set `AT-001..AT-006` (no scope changes).

## Response (PM)
Type: Blocking
Issue resolution:
- I-003: Resolved — PM is the approver for `PM_to_Dev` and sets `Status: Approved` by appending `## Approval (PM)` (precedent: `.ai/archive/FEATURE-001/PM_to_Dev.md` uses `## Approval (PM)` to unblock DEV work).
Answer:
- Q-004: DEV should NOT set `Status: Approved` on `PM_to_Dev`; DEV begins implementation once this PM document is Approved and then produces evidence in `Dev_to_Gov`.
Correction:
- The earlier suggestion in `## Response (PM)` that DEV should approve this contract was incorrect; approval authority remains with PM for this handoff.
Decision needed:
- None.

## Approval (PM)
Approved:
- scope: FEATURE-002 CI + GitHub Pages hosting (S-001..S-004; OOS-001..OOS-003)
- acceptance set: AT-001..AT-006 (maps to BA SC-001..SC-005)
Notes:
- DEV is unblocked to implement; any scope changes must be raised back here as a Challenge before coding beyond the contract.
