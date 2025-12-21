# GOV Decision: QA-006 Durability Testing Pattern

**Date**: 2025-12-21  
**Feature**: FEATURE-001  
**Decision**: Establish semantic snapshot testing as the standard for durability assertions across Reload/Reopen.  
**Status**: APPROVED (post-implementation)  
**Owner**: GOV  

---

## Problem Statement

### Observed Flakiness
QA-006 (durability: Reload + Reopen preserves state) initially failed intermittently, showing MIXED/FAIL results even when:
- Item text was unchanged
- Hierarchy was unchanged
- Completion state was unchanged
- Formatting was unchanged

### Root Cause
The test harness compared **raw DOM innerHTML strings** before vs after Reload/Reopen. Browsers and frameworks legitimately change DOM serialization without semantic changes:

Examples:
- Boolean attributes (`checked=""`) appear/disappear in serialized HTML without changing the property state.
- Whitespace normalization (contenteditable adds/removes `<br>`, ZWSP, newlines).
- Tag normalization (`<b>` vs `<strong>`, `<i>` vs `<em>`).
- Framework re-rendering can reorder attributes.

**Pattern**: Testing against **implementation details (DOM serialization)** instead of **behavior (semantic state)** caused false failures.

---

## Solution Applied

### 1. Semantic Snapshot Helper
App exposes `window.__MVP_QA__.semanticSnapshotFromDom()` which:
- Walks each horizon's DOM tree (`.listHost[data-list="..."]`)
- Captures **semantic** state (not serialization):
  - `text` — item textContent (ignoring ZWSP, BR)
  - `html` — normalized HTML (canonical <b>/<i> only)
  - `children` — hierarchy as tree
  - `completed` — from `checkbox.checked` property (not attribute)

### 2. Assertion Pattern Change
**Before**: `expect(host.innerHTML before === host.innerHTML after)` ❌ Flaky  
**After**: `expect(JSON.stringify(semanticSnapshotFromDom()) before === after)` ✓ Stable

### 3. Supporting Fixes
- Removed auto-inserted placeholder items on load → empty lists stay empty
- Canonicalized empty editor HTML (`<br>` → `""`, ZWSP stripped) → no "invisible" state
- Forced checkbox to never carry `checked=""` attribute in HTML → state in property only
- Prevented no-op localStorage writes → reduce timestamp churn

---

## Results

✓ QA-006 passed 3 consecutive runs (Reload + Reopen) with zero flakiness.  
✓ No false negatives (real state loss would still be caught).  
✓ Future features can reuse the same pattern.

---

## Principle for Future Features

### **Test Behavior, Not Implementation**

When designing acceptance tests for durability, persistence, or state preservation:

1. **Identify the semantic requirement** (e.g., "user's items and formatting survive a reload").
2. **Capture semantic state** (text, hierarchy, properties, not DOM serialization).
3. **Compare meaning** (JSON equality of semantic snapshots).
4. **Ignore serialization artifacts** (DOM string format changes are legitimate).

### Anti-pattern to Avoid
❌ Comparing raw `innerHTML`, `outerHTML`, or `textContent` before/after operations that might re-render.  
❌ Asserting exact DOM structure when framework/browser is free to change it.  
❌ String-based diffs on DOM that include boolean attributes, whitespace, or tag aliases.

### Pattern to Follow
✓ Capture semantic snapshots (structured data representing user intent).  
✓ Normalize serialization (strip ZWSP, use canonical tag names, read properties not attributes).  
✓ Compare JSON serialization of semantic state, not DOM strings.

---

## Application to FEATURE-001

For AT-009 (SC-007 durability):
- **Acceptance**: Reload + Reopen preserves items, hierarchy, formatting, completion.
- **Verification**: `JSON.stringify(window.__MVP_QA__.semanticSnapshotFromDom()) before === after`
- **Flakiness Risk**: ✓ ELIMINATED by semantic snapshot approach.

---

## Recommendation for Future Features

### For Feature Teams
When building features with state durability requirements (localStorage, IndexedDB, APIs):
1. **Design a semantic snapshot function** (similar to `__MVP_QA__.semanticSnapshotFromDom()`).
2. **Use it in QA harness** for all durability/persistence assertions.
3. **Document the mapping**: What parts of state are semantic vs serialization artifacts.

### For QA/Harness Authors
- **Never assert on raw DOM/serialization**. Always extract semantic meaning first.
- **Test intent, not implementation**. Framework/browser changes are OK if semantics survive.

### For GOV Reviews
- **Require semantic snapshot design** in PM_to_Dev / Dev_to_Gov handoffs for any feature touching persistence.
- **Call out string-based durability assertions** as flakiness risks.
- **Approve durability tests** only if they compare semantic state, not DOM serialization.

---

## References

- **FEATURE-001 Archive**: `.ai/archive/FEATURE-001/gov-review.md` (Post-Task Delta section)
- **Implementation**: `my-todo/src/App.jsx` — `window.__MVP_QA__.semanticSnapshotFromDom()`
- **QA Pattern**: Compare `JSON.stringify(snapshot before) === JSON.stringify(snapshot after)`

---

## Decision Record

| Item | Value |
|------|-------|
| **Approved By** | GOV |
| **Effective** | FEATURE-002 onwards |
| **Scope** | All features with durability/persistence requirements |
| **Reversible** | Yes (guidance only; no code lock-in) |
| **Impact** | Eliminates flaky durability tests; improves QA reliability |

---

**GOV Signature**: Governance decision recorded. Future features should apply this pattern.
