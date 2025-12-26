# GOV Review — FEATURE-002: CI + GitHub Pages Hosting

**Completed**: 2025-12-22  
**Feature ID**: FEATURE-002  
**Status**: ✅ APPROVED  
**Reviewer**: GOV AI

---

## 1) Review Summary

**Scope**: CI validation on PRs + automatic GitHub Pages deployment from `main` branch.

**Result**: ✅ **APPROVED** — All acceptance tests PASS with live verification.

**Changeset**: 4 files (ci.yml, pages.yml, vite.config.js, README.md) — minimal, focused, zero scope creep.

**Traceability**: SC ↔ AT ↔ Evidence chain intact; all 6 acceptance tests mapped and verified.

---

## 2) Acceptance Test Evidence

| AT | Map | Status | Evidence |
|----|----|--------|----------|
| AT-001 | SC-002 | ✅ PASS | PR triggers CI; PASS/FAIL visible |
| AT-002 | SC-002 | ✅ PASS | Node 20.19.0 pinned; `npm ci` with lockfile |
| AT-003 | SC-003 | ✅ PASS | Push to `main` auto-deploys; commit-linked |
| AT-004 | SC-001 | ✅ PASS (live) | Pages URL loads in incognito; UI renders |
| AT-005 | SC-004 | ✅ PASS (live) | JS/CSS assets load 200; no 404s; refresh works |
| AT-006 | SC-005 | ✅ PASS | README includes checklist + "local-only" + routing note |

**All AT PASS.** No failures; no deferred validations.

---

## 3) Drift Check

**Charter Alignment**:
- DA-001 (tags/views/databases): Not in scope ✓
- DA-002 (collaboration/accounts): Not in scope ✓
- DA-003 (heavy frameworks): N/A (infrastructure work) ✓
- **No drift detected.**

**Scope Boundaries**:
- IN-001..IN-004: ✓ All delivered
- OUT-001..OUT-005: ✓ Correctly excluded (Cloudflare noted for FEATURE-003)
- **Scope clean.**

---

## 4) Implementation Quality

**CI Workflow** (ci.yml):
- Triggers: `pull_request` to `main` + `workflow_dispatch` ✓
- Build env: Ubuntu latest, Node 20.19.0 pinned ✓
- Determinism: `npm ci` from lockfile ✓
- Working dir: `my-todo/` (correct) ✓

**Pages Deploy Workflow** (pages.yml):
- Permissions: Read contents, write pages, id-token ✓
- Concurrency: Proper group (pages) with cancel-in-progress ✓
- Build + Deploy: Two jobs, proper dependency ✓
- Artifact: `my-todo/dist` published to Pages ✓

**Vite Config** (vite.config.js):
- Base detection: `GITHUB_REPOSITORY` env var ✓
- Base calculation: `/<repo>/` on build (correct subpath) ✓
- Dev base: `/` (correct, not build-time base) ✓
- No hardcoded URLs; clean ✓

**Documentation** (README.md):
- Local dev instructions ✓
- Pages hosting explanation ✓
- Verification checklist (non-technical) ✓
- Rollback instructions ✓
- **"Local-only per device/browser" language explicit** ✓

**No anti-patterns.** Code is minimal, correct, maintainable.

---

## 5) Governance Decision Alignment

| Decision | Status |
|----------|--------|
| GOV-2025-12-21-001 (Semantic Snapshot Testing) | N/A (no persistence) |
| GOV-2025-12-21-002 (QA Patterns) | N/A (infrastructure, no UI QA) |
| CHARTER-2025-12-21-001 (Project Charter) | ✅ Aligned — adds reliability, not features |

**No decision conflicts.** New decision opportunity noted below.

---

## 6) Risk Assessment

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|-----------|--------|
| Pages permissions blocked | Low | Release-blocking | User enabled Pages + made repo public | ✅ Resolved |
| Asset 404s from Pages URL | Very Low | UX broken | Vite base logic + AT-005 test | ✅ Covered |
| CI flakiness (env drift) | Very Low | Merge blocking | Node pinned, npm ci, minimal steps | ✅ Covered |
| Repo visibility prevents publish | Low | Release-blocking | User made repo public | ✅ Resolved |

**All identified risks mitigated or resolved.**

---

## 7) Post-Task Lessons Learned

### BA Insights
1. **Lock hosting target early** — FEATURE-002 KD-001 correctly identified GitHub Pages at problem definition. When multi-platform options exist, put the chosen one in KD and alternatives in OUT to avoid mid-flight pivots.
2. **Convert unknowns to assumptions** — Converting Q-001/Q-002 into A-004..A-006 unblocked PM and DEV faster than leaving them open.
3. **Add "platform pivot" to drift alarms** — User request for Cloudflare should trigger FEATURE-003, not a patch to FEATURE-002. Charter § Drift alarms should include: "Requests to switch hosting platforms without prior approval."

### PM Insights
1. **Make approval authority explicit upfront** — PM_to_Dev challenge cycle clarified that PM (not DEV) approves PM_to_Dev. Future templates should state: "Approver: PM; review authority over scope and acceptance tests."
2. **Encode environment facts early** — DEP-001..DEP-005 prevented guessing about branch, package manager, app path, and Pages target shape. Future contracts: list environment prereqs (branch, package manager, build folder, deployment platform) as first-class dependencies.
3. **Call out repo-level settings as blocking** — GitHub Pages "Source: GitHub Actions" is not code; it's infrastructure. Future PM contracts with infrastructure scope should list: "Repo settings prerequisites (Settings → Pages → Source, etc.)" as a first-class dependency.
4. **Treat routing expectations as part of scope** — A-006 (root-only routing) is easy to overlook but critical for Pages acceptance. Future contracts: "Routing expectation: [single route / deep links / N/A]" as explicit SC or assumption.
5. **Don't block on generated artifacts** — DEV initially challenged missing `.ai/decisions.yml` / `.ai/standards.md`. AGENTS.md clarifies these are optional. Future gate checks: "If artifact missing, refer to AGENTS.md § required vs optional."

### DEV Insights
1. **Node version constraints are non-negotiable** — FEATURE-002 pinned Node 20.19.0 because Vite + modern plugins require `>= 20.0.0`. "Works locally, fails in Actions" is a common trap. Future: State Node version in AT-002 (or equivalent) and document in workflows.
2. **Vite + GitHub Pages requires special base logic** — Deriving `base` from `GITHUB_REPOSITORY` prevents manual URL corrections per build. Future: If using Vite on Pages, include this pattern in templates; document the GITHUB_REPOSITORY env var.
3. **Workflow context matters** — Running workflows from `my-todo/` (not repo root) is critical because `npm ci` and `npm run build` need the right working directory. Future: Call out app path in AT and DEP sections.
4. **Windows local verification is unreliable** — Locked binaries (esbuild.exe) can prevent local builds but don't affect remote Actions. Future: Document "GitHub Actions is authoritative for build verification; local failures may not reflect CI behavior."
5. **GitHub Pages has non-code prerequisites** — "Source: GitHub Actions" setting, repo public/private status, and Pages feature availability are not code. Future: List these in FM (Failure Modes) + verification checklist + rollback plan explicitly.

---

## 8) Organizational Learning — Suggested Decision Record

**Proposed New Decision**: "GitHub Pages + Vite SPA Hosting Pattern"

**Context**:
- FEATURE-002 demonstrated a repeatable pattern: detect `GITHUB_REPOSITORY`, set Vite base, deploy via GitHub Actions to Pages.
- Future SPAs on Pages will likely reuse this pattern.

**Recommendation**:
- Create decision record: "For GitHub Pages project sites hosting Vite SPAs, derive base from GITHUB_REPOSITORY env var in build context; document Node version requirement >= 20.0.0."
- Add to `.ai/standards.md` or `.ai/decisions.yml` for FEATURE-003+.

---

## 9) Recommendations for FEATURE-003 (Cloudflare Pages)

**Scope for next feature**:
- BA: Define Cloudflare Pages as hosting alternative; clarify when to use Cloudflare vs GitHub Pages.
- PM: Create acceptance tests for Cloudflare deploy + verification.
- DEV: Implement wrangler workflow; handle account/API token management.
- GOV: Compare feature parity (CI, deploy, rollback, verification) with FEATURE-002.

**Assumption**: FEATURE-002 (GitHub Pages) remains the default; FEATURE-003 adds Cloudflare as opt-in.

---

## 10) Final Verdict

### Approval
✅ **APPROVED**

**Conditions**: None blocking. Feature is releasable.

**Optional Improvements** (non-blocking):
- [ ] Add comment in vite.config.js explaining GITHUB_REPOSITORY detection for future maintainers.
- [ ] Update `.ai/standards.md` to include "GitHub Pages + Vite pattern" (or defer to FEATURE-003 comparison).

**Deviations from Plan**:
- Repo made public (user choice to avoid GitHub upgrade). Documented and acceptable per FEATURE-002 scope.

---

## 11) Archive Actions (Complete)

✅ Copied 3 handoffs to `.ai/archive/FEATURE-002/`:
- BA_to_PM.md (Approved)
- PM_to_Dev.md (Approved)
- Dev_to_Gov.md (Approved by GOV)

✅ Created gov-review.md (this file)

**Next action**: Reset working handoffs to templates for FEATURE-003.

---

**Reviewed by**: GOV AI  
**Date**: 2025-12-22  
**Archive Location**: `.ai/archive/FEATURE-002/`  
**Status**: Complete ✅
