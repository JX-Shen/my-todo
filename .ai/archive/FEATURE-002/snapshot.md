# FEATURE-002 Snapshot — CI + GitHub Pages Hosting

**Project**: Minimalist Web TODO (Workflowy-like)  
**Feature ID**: FEATURE-002  
**Completed**: 2025-12-22  
**Status**: ✅ APPROVED & DEPLOYED

---

## North Star
Make the current Vite/React task app reliably accessible via GitHub Pages with automatic CI validation on every PR.

---

## Success Criteria (All PASS)
- SC-001: GitHub-hosted URL exists; loads in clean session ✅
- SC-002: CI runs on PRs; reports clear PASS/FAIL ✅
- SC-003: Default-branch changes auto-deploy without manual steps ✅
- SC-004: Hosted app loads without broken JS/CSS assets ✅
- SC-005: Non-technical verification checklist exists ✅

---

## Acceptance Tests (All PASS)
| AT | Description | Status |
|----|-------------|--------|
| AT-001 | PR triggers CI workflow | ✅ PASS |
| AT-002 | CI pinned Node 20.19.0, npm ci from lockfile | ✅ PASS |
| AT-003 | Push to main triggers Pages deploy | ✅ PASS |
| AT-004 | Pages URL loads app UI in incognito | ✅ PASS (live) |
| AT-005 | Assets load without 404s; refresh works | ✅ PASS (live) |
| AT-006 | README checklist + "local-only" language | ✅ PASS |

---

## Deliverables (All Complete)
- ✅ `.github/workflows/ci.yml` — PR build validation
- ✅ `.github/workflows/pages.yml` — Auto-deploy to GitHub Pages
- ✅ `my-todo/vite.config.js` — Base path detection for repo subpath
- ✅ `my-todo/README.md` — Local dev + verification checklist

---

## Key Decisions
1. **GitHub Pages as hosting target** — Keeps delivery inside GitHub; minimal ops overhead.
2. **CI as quality gate** — Prevents broken builds reaching hosted URL.
3. **Root-only routing** — MVP does not guarantee deep-link support on Pages.
4. **Local-only per device** — Hosting provides access; data remains local to browser.

---

## Top 3 Risks & Status
| Risk | Resolution |
|------|-----------|
| Pages permissions block deploy | ✅ Resolved: User enabled Pages + made repo public |
| Asset 404s from incorrect base | ✅ Covered: Vite base logic + AT-005 verification |
| Repo visibility prevents publish | ✅ Resolved: Repo is now public |

---

## Lessons Learned (By Role)

### BA
- Lock hosting target early; use KD (Key Decisions) to anchor scope.
- Convert unknowns to assumptions to unblock downstream work.
- Add "platform pivot" to drift alarms for multi-option features.

### PM
- Encode environment facts (branch, package manager, build folder) as explicit dependencies.
- Treat repo-level settings as first-class blockers, not afterthoughts.
- Make approval authority explicit ("PM approves PM_to_Dev").

### DEV
- Pin Node version; state it in AT and document in workflows.
- For Vite on GitHub Pages: derive base from GITHUB_REPOSITORY env var.
- GitHub Pages has non-code prerequisites (Settings → Pages); list in FM + checklist.

### GOV
- Optional artifacts (decisions.yml, standards.md) should not block gates.
- Distinguish "code review" (implementation) from "governance review" (traceability + drift).
- Propose decision records for repeatable patterns (e.g., "Vite + Pages pattern").

---

## Recommended Follow-Ups

1. **FEATURE-003**: Cloudflare Pages as alternative hosting (future).
2. **Standards Update**: Add "GitHub Pages + Vite pattern" to `.ai/standards.md`.
3. **Charter Amendment**: Add "platform pivot" to drift alarms in charter.

---

**Archived by**: GOV AI  
**Archive Location**: `.ai/archive/FEATURE-002/`
