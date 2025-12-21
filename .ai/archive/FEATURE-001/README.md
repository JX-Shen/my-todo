# FEATURE-001 Archive Index

**Feature**: Minimalist Web TODO (three-list personal task tool)  
**Status**: COMPLETE & APPROVED  
**Date**: 2025-12-21  
**Release**: MVP Ready  

---

## Archive Contents

### Handoff Documents (Process)
- **BA_to_PM.md** (13.4 KB) — Problem definition, success criteria, non-goals, drift checks
- **PM_to_Dev.md** (11.4 KB) — Scope, acceptance tests (AT-001..AT-010), QA script, GitHub issues
- **Dev_to_Gov.md** (6.5 KB) — Implementation summary, changeset, acceptance mapping, verification, GOV approval

### Review & Governance
- **gov-review.md** (5.8 KB) — GOV pass/fail review, traceability check, risk assessment, post-task delta
- **GOV-decision-durability-testing.md** (5.6 KB) — Decision record on semantic snapshot testing for durability
- **GOV-conclusion-QA-lessons.md** (8.9 KB) — Full analysis of QA-006 flakiness and lessons for future features
- **QA-standards-semantic-testing.md** (6.6 KB) — Reusable QA testing standards and anti-patterns

---

## Key Links

### For Next Feature Team (FEATURE-002)
1. Read: `.ai/charter.md` (project context)
2. Read: `.ai/AGENTS.md` (governance framework)
3. Reference: `QA-standards-semantic-testing.md` (if you have durability/persistence)
4. Reference: `GOV-decision-durability-testing.md` (if you have durability/persistence)

### For QA/Testing
- `QA-standards-semantic-testing.md` — Patterns and anti-patterns for robust testing

### For Lessons & Post-Mortems
- `GOV-conclusion-QA-lessons.md` — Complete analysis of QA-006 flakiness

### For Governance Review
- `gov-review.md` — How FEATURE-001 was reviewed and approved

---

## Feature Summary

**North Star**: Open the page and immediately capture/organize tasks with keyboard flow; the checklist feels reliable and calming.

**Scope** (MVP In):
- Three always-visible lists: 90+ days / 30 days / Minimum todo
- Nested list structure with keyboard-first editing
- Checkbox completion with strikethrough + gray
- 30-day markmap export
- Durable local storage (Reload + Reopen)

**Out of Scope** (Anti-Notion):
- Accounts, collaboration, sharing
- Tags, filters, databases
- Multi-view (kanban, calendar)
- Rich content blocks

**P0 Acceptance Gates** (all passed):
- AT-002: Keyboard create ✓
- AT-003: Keyboard edit ✓
- AT-004: Keyboard delete ✓
- AT-005: Tab/Shift+Tab indent/outdent ✓
- AT-006: Ctrl+B/I formatting ✓
- AT-007: Ctrl+Z/Y undo/redo ✓
- AT-009: Durability (Reload + Reopen) ✓

---

## Key Decisions & Lessons

### Decision: Semantic Snapshot Testing (GOV)
**Approved**: All features with durability must use semantic snapshots, not DOM strings.  
**Impact**: Eliminates flaky tests; ensures robust QA.  
**Effective**: FEATURE-002 onwards.

### Lesson: Test Behavior, Not Implementation
QA-006 flakiness was caused by testing DOM serialization instead of semantic state. Browsers legitimately change HTML representation without changing meaning. Solution: snapshot the data model, not the DOM.

### Lesson: QA Stability Is Governance
When tests flake intermittently, it's a design issue at the governance level (acceptance test contract), not just a dev/QA issue. GOV must require semantic testing approach upfront.

---

## Release Readiness

✓ All acceptance tests pass  
✓ Build succeeds  
✓ No blocking issues  
✓ Risk profile low and acceptable  
✓ QA-006 durability verified with semantic snapshots  
✓ Governance decisions documented  

**Status**: READY FOR MVP RELEASE

---

## For Next Feature Cycle (FEATURE-002)

1. **Reset working handoffs** (already done)
   - BA_to_PM.md → template with FEATURE-###
   - PM_to_Dev.md → template with FEATURE-###
   - Dev_to_Gov.md → template with FEATURE-###

2. **Apply lessons from FEATURE-001**
   - Include semantic snapshot design in PM_to_Dev if persistence is in scope
   - Reference QA-standards-semantic-testing.md in handoffs
   - Require semantic testing approach in GOV approval

3. **Start BA phase** — BA AI reads charter.md + AGENTS.md and creates BA_to_PM.md

---

**Archive Prepared By**: GOV  
**Date**: 2025-12-21  
**Status**: FROZEN (read-only record)

---

## Statistics

| Metric | Value |
|--------|-------|
| Feature Duration | ~1 day (single session) |
| Handoff Documents | 3 (BA→PM→DEV→GOV) |
| Acceptance Tests | 10 (AT-001..AT-010) |
| Success Criteria | 8 (SC-001..SC-008) |
| P0 Gates | 7 (all passed) |
| QA Flakiness Issues | 1 (QA-006, resolved) |
| Governance Decisions | 2 (durability testing, QA standards) |
| Lines of Code | ~900 (my-todo/src/App.jsx) |
| Build Size | 206.27 kB JS, 2.69 kB CSS |
| Release Status | MVP Ready ✓ |
