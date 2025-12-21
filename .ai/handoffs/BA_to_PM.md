Handoff: BA_to_PM
ID: FEATURE-002
Status: Approved
Owner: BA
Mode: L2
Last updated: 2025-12-21
Links:
  Upstream: N/A
  Downstream: .ai/handoffs/PM_to_Dev.md

---

## 1) Product Intent (5 lines)
- Make the current Vite/React app reliably accessible via a stable GitHub-hosted URL (GitHub Pages) for daily personal use and demos.
- Ensure every change is automatically validated in GitHub CI so the default branch stays deployable.
- Keep the workflow low-friction for a solo user: open link, use app, close—no local setup required to view the latest version.
- Preserve the project’s anti-Notion stance: this feature adds delivery reliability, not product surface area or complexity.
- Keep durability expectations clear: hosting provides access, but data remains local to each browser/device (no cloud sync).

## 2) Target Usage Moments & “Success Feeling”
- Moment: Open app from a bookmark on any device -> feeling: “It’s always there; no ‘run locally’ tax.”
- Moment: Merge a small change -> feeling: “It deploys itself; I don’t have to remember steps.”
- Moment: Share a demo link -> feeling: “I can show the current build instantly and confidently.”
- Moment: CI check on a PR -> feeling: “Breakage is caught before it reaches the hosted URL.”

## 3) Problem Statement (≤5 bullets)
- PS-001: Without a hosted URL, access across machines and quick demos require manual setup.
- PS-002: Without CI, regressions can land unnoticed, making the hosted experience unreliable and eroding trust.
- PS-003: Ad-hoc deployment steps create inconsistency (environment drift) and “works on my machine” risk.
- PS-004: GitHub Pages URL structure (often repo-subpath) can break assets/routing if not accounted for.

## 4) Success Criteria (SC-###) — testable yes/no
- SC-001: A GitHub-hosted URL exists for the app and loads successfully in a clean browser session.
- SC-002: On every pull request targeting the default branch, GitHub CI runs and reports a clear PASS/FAIL status.
- SC-003: On change to the default branch, the hosted URL updates to the new version without manual steps.
- SC-004: The hosted app loads without broken JS/CSS assets when served from the GitHub Pages URL structure (including repo subpath if applicable).
- SC-005: A non-technical verification checklist exists that another person can follow to confirm SC-001..SC-004.

## 5) Success Metrics (Leading Indicators)
- SM-001: CI reliability: % of PRs where CI status is reported and deterministic (no flaky pass/fail).
- SM-002: Deployment reliability: % of default-branch changes that result in a successful publish event.
- SM-003: “Time-to-link”: sharing the current app requires only sending the URL (no setup instructions for the viewer).
- SM-004: Support load proxy: # times “site is blank/broken” is observed after deploy (target: near-zero).

## 6) MVP Scope Boundaries: IN vs OUT (match charter; emphasize anti-Notion)
### IN (MVP)
- IN-001: GitHub CI validates the project on PRs (build must succeed; failures visible).
- IN-002: Hosted delivery via GitHub Pages with a stable URL for the current build.
- IN-003: Minimal documentation for running locally and for verifying a deployment (human steps, not code).
- IN-004: No change to product scope beyond what is required to serve the existing single-page app correctly from the hosted URL.

### OUT (MVP) — guardrails
- OUT-001: Any new end-user features (tags, views, collaboration, accounts, databases, rich blocks) — unchanged from charter non-goals.
- OUT-002: Cloud sync / login / “same tasks on every device” behavior.
- OUT-003: Alternative hosting platforms (Netlify/Vercel/etc.) unless GitHub Pages is proven infeasible.
- OUT-004: Preview deployments per PR, custom domains, analytics/SEO, or performance tuning as deliverables.
- OUT-005: Deep-link routing guarantees beyond the root path ("/") unless separately approved.

## 6.1) Non-goals (NG-###) — explicit OUT (mirrors charter)
- NG-001: Collaboration/sharing/accounts/permissions.
- NG-002: Notion-like complexity: tags/filters/databases/backlinks/templates/dashboards; multi-view.
- NG-003: Rich content blocks beyond minimal formatting.

## 7) Key Product Decisions (and why)
- KD-001: Use GitHub Pages as the hosting target — keeps delivery inside GitHub; minimal operational overhead.
- KD-002: Treat CI as the quality gate for deployability — prevents “broken default branch” reaching the hosted URL.
- KD-003: Keep acceptance focused on hosted availability + correctness — avoid scope creep into app features or platform sprawl.
- KD-004: Document the “local-only per device” expectation explicitly — hosting does not change the single-user, local durability model.
- KD-005: Treat routing as single-route by default — accept "/" only; no deep-link requirement for MVP hosting.

## 8) Top Risks & Mitigations
- R-001 (Blocking risk): Expectation mismatch — a hosted URL may be mistaken for cloud sync.
  - Mitigation: Explicitly state “local-only per device/browser” in docs (and in-app copy only if needed).
- R-002: GitHub Pages path/routing issues cause blank page or broken assets.
  - Mitigation: Make “loads correctly from Pages URL structure” part of acceptance (SC-004) and verify in clean sessions.
- R-003: CI fails due to environment drift (Node/tooling differences), slowing iteration.
  - Mitigation: Standardize a single supported build environment in CI and document it.
- R-004: Repo visibility/permissions block Pages publishing.
  - Mitigation: Confirm repo visibility constraints early; choose the simplest compatible publishing mode.

## 9) MVP Milestone Definition + explicit “NOT in v1” (no timelines)
- M1 (CI Gate Ready): PRs show an unambiguous CI PASS/FAIL signal for the app build.
- M2 (Hosted URL Ready): A GitHub Pages URL is published and loads successfully in a clean browser session.
- M3 (Operate + Verify Ready): A short verification checklist exists and has been run at least once end-to-end after a deploy.
- NOT in v1: PR previews; custom domain; analytics; performance tuning as a deliverable; any new app features; cloud sync.

## 10) Assumptions (A-###)
- A-001: Hosting target is GitHub Pages (GitHub-provided URL), not an external hosting provider.
- A-002: The app remains a single-user, local-first tool; hosting does not introduce accounts or cloud sync.
- A-003: The default branch is the source of truth for the hosted URL (“latest”).
- A-004: “Local-only per device/browser” is acceptable for MVP hosting (no shared task state across devices).
- A-005: Repo visibility/permissions allow publishing GitHub Pages (or an equivalent GitHub-native Pages mode is allowed).
- A-006: The app does not require client-side routes beyond "/" for MVP hosting acceptance.

## 11) Open Questions (Q-###) — max 5, only if truly blocking
- None. If A-004..A-006 are not acceptable, PM should re-challenge and BA will revise scope/SC accordingly.

## 12) Options (A/B) — no implementation detail
### Option A: GitHub Pages (default)
- Pros: GitHub-native; stable URL; minimal ops; aligns with solo-project posture.
- Cons: URL path constraints; permissions/visibility nuances.
- Risks: Misconfiguration leads to blank page; confusing caching behavior.

### Option B: Alternate static hosting (fallback only)
- Pros: Often simpler SPA hosting defaults and previews.
- Cons: Adds platform surface area; may introduce auth/secrets and extra ops.
- Risks: Drift away from “GitHub-only” workflow; harder to keep consistent.

## 13) Drift Check — off-track if...
- DC-001: Requests add product features (tags/views/accounts/collaboration/databases/blocks) under the guise of “deployment work.”
- DC-002: Hosting work implicitly commits to cloud sync or multi-user expectations (conflicts with charter non-goals).

## 14) GitHub Issue Breakdown (Title + Description + AC + Dependencies + Effort S/M/L + Owner role)
- Issue: FEATURE-002 acceptance contract for CI + hosting
  - Description: Convert BA success criteria into a crisp acceptance contract for PM (including explicit “local-only per device” language).
  - AC: PM_to_Dev includes AT-### mapping to SC-001..SC-005; OUT list mirrored; Q-001/Q-002 resolved or explicitly accepted as assumptions.
  - Dependencies: This BA_to_PM approved.
  - Effort: S
  - Owner role: PM

- Issue: CI PR gate for build validity
  - Description: Ensure every PR runs a repeatable validation that catches broken builds before merge.
  - AC: SC-002 met; CI status visible on PR; failures are treated as merge-blocking by policy.
  - Dependencies: FEATURE-002 acceptance contract for CI + hosting.
  - Effort: M
  - Owner role: DEV

- Issue: GitHub Pages publish workflow
  - Description: Publish the built static app to GitHub Pages automatically from the default branch.
  - AC: SC-001 and SC-003 met; a stable Pages URL exists; new default-branch changes publish without manual intervention.
  - Dependencies: CI PR gate for build validity.
  - Effort: M
  - Owner role: DEV

- Issue: Hosted path correctness smoke check
  - Description: Validate the hosted app loads correctly from the Pages URL structure (including repo subpath behavior).
  - AC: SC-004 met; no broken assets in a clean session; basic interaction works (add/edit a task) on hosted site.
  - Dependencies: GitHub Pages publish workflow.
  - Effort: S
  - Owner role: DEV + GOV (review)

- Issue: Minimal docs for local run + deploy verification
  - Description: Write short, user-facing instructions to run locally and to verify a deployment.
  - AC: SC-005 met; docs include: how to open hosted URL, what “local-only per device” means, and a short verification checklist.
  - Dependencies: GitHub Pages publish workflow.
  - Effort: S
  - Owner role: DEV (with BA wording review)

- Issue: Rollback / recovery note for bad deploy
  - Description: Define what “rollback” means for a static hosted build and how to recover if the hosted URL is broken.
  - AC: A clear recovery approach exists (at least: how to restore a previously known-good build) and is documented.
  - Dependencies: GitHub Pages publish workflow.
  - Effort: S
  - Owner role: PM + DEV

---

## Challenge / Response / Approval (append-only)

## Challenge (PM)
Type: Blocking
Issues raised:
- ID: I-001
  Type: Blocking
  Statement: PM cannot draft `.ai/handoffs/PM_to_Dev.md` until the two explicitly-blocking open questions are resolved (data locality + repo visibility/Pages constraints).
  Evidence: BA_to_PM §11 (Q-001, Q-002) marked “Blocking”; AGENTS.md §0.4 “Upstream gate is hard”.
  Proposal: Resolve Q-001 and Q-002 in BA_to_PM (either as confirmed assumptions or updated SC/constraints) and add a short approval-ready statement.
  Owner: BA
  Status: Open
- ID: I-002
  Type: Blocking
  Statement: Hosting target details are underspecified for acceptance (what “GitHub-hosted URL” means operationally).
  Evidence: BA_to_PM §4 (SC-001..SC-004) + user request wording “github help me hosting”.
  Proposal: Confirm the intended hosting is GitHub Pages (GitHub-provided URL) and whether the repo is expected to be public or private when publishing.
  Owner: BA
  Status: Open
- ID: I-003
  Type: Non-blocking
  Statement: SPA routing expectations are not stated; GitHub Pages can 404 on deep links if the app uses client-side routes beyond `/`.
  Evidence: BA_to_PM §3 (PS-004: path/routing issues) but no explicit expected behavior.
  Proposal: Add a 1-sentence expectation: either “single route only” or “deep links must work (define behavior on refresh)”.
  Owner: BA
  Status: Open
Questions:
- Q-001: Confirm acceptance of “local-only per device/browser” for the hosted app (no cross-device sync) as a non-negotiable assumption for FEATURE-002.
- Q-002: Confirm repo visibility constraint (public vs private) and whether GitHub Pages must work under private-repo constraints.
- Q-003: Confirm whether the app uses client-side routes beyond `/`; if yes, define expected deep-link and refresh behavior on GitHub Pages.
Proposed revision:
- Update BA_to_PM §10–§11 to resolve Q-001/Q-002 (move to Assumptions/Constraints or update SC).
- Add a short routing expectation note aligned to PS-004/SC-004.

## Response (BA)
Issue resolution:
- I-001: Resolved — converted Q-001/Q-002 into explicit assumptions (A-004, A-005) so PM can proceed.
- I-002: Resolved — reaffirmed GitHub Pages as the intended “GitHub-hosted URL” target (A-001) and captured permissions/visibility requirement (A-005).
- I-003: Resolved — stated routing expectation (OUT-005, KD-005, A-006).
Revision summary:
- Removed blocking questions by making them explicit assumptions; clarified MVP stance on deep links.
Decision needed:
- None unless assumptions A-004..A-006 are rejected.

## Approval (PM)
Approved:
- scope: FEATURE-002 CI + GitHub Pages hosting (SC-001..SC-005; IN-001..IN-004; OUT-001..OUT-005)
- acceptance set: SC-001..SC-005 with assumptions A-004..A-006
Notes:
- Treat A-005 (Pages permission/visibility) as a deployment prerequisite to validate early.
