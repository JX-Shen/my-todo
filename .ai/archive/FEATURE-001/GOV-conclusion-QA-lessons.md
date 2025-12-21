# GOV Conclusion: QA-006 Flakiness & Governance Lessons

**Date**: 2025-12-21  
**Context**: Post-mortem analysis of QA-006 (durability) flakiness in FEATURE-001  
**Status**: Documented & Approved  
**Audience**: BA, PM, DEV, GOV (future feature teams)  

---

## Executive Summary

QA-006 (durability: Reload + Reopen preserves state) exhibited intermittent MIXED/FAIL results despite **no actual data loss**. Root cause: the test harness compared **raw DOM innerHTML strings**, which are unstable across browser re-serialization. 

**Fix**: Switch to **semantic snapshot comparison** (JSON equality of structured state rather than DOM strings).

**Outcome**: Eliminated flakiness; zero false negatives (real loss would still be caught); established a reusable pattern for all future durability tests.

**Governance Impact**: QA testing standards are now codified; future features must apply semantic testing approach for any persistence layer.

---

## The Problem: False Failures Due to Implementation Details

### What Happened
- QA-006 test ran 5 times across different configurations
- Results: PASS, FAIL, PASS, MIXED, PASS
- **Root cause**: Not an actual problem with persistence, but with **how the test measured it**

### Why It Failed Intermittently
Browsers and frameworks legitimately change DOM serialization without changing semantic state:

```html
<!-- Before Reload (Playwright snapshot) -->
<input type="checkbox" class="treeCheckbox">

<!-- After Reload (browser re-renders) -->
<input type="checkbox" class="treeCheckbox" checked="">
```

Both represent the same state (`checked: true`), but the **HTML string changed**.

### False Negatives Risk
If the test had been too strict or run in a different environment, it might have:
- Failed when it should pass (wasted engineering time)
- Passed when it should fail (missed real data loss)
- Flaked intermittently (low confidence in test suite)

---

## Why This Is a Governance Issue (Not Just a Dev Issue)

### System-Level Problem
The **acceptance testing framework** was broken at design time:
- BA defined SC-007 as "items/hierarchy/completion survive Reload"  ✓ Good
- PM defined AT-009 as a test of that  ✓ Good
- **But nobody specified HOW to measure "survive"** ✗ Gap

### Testing Anti-pattern
Testing against **implementation details** (DOM serialization) instead of **user intent** (data preservation).

### Lessons for Governance
1. **Acceptance tests must be resilient to implementation changes** (framework upgrades, browser updates, etc.)
2. **Durability assertions require semantic snapshots**, not string comparisons
3. **QA stability is a governance responsibility**, not just a dev concern

---

## What GOV Should Conclude

### Principle 1: Test Behavior, Not Implementation
Acceptance tests must verify **what users experience** (data persists), not **how the code implements it** (specific DOM structure, HTML serialization, event details).

### Principle 2: Durability Tests Need Semantic Snapshots
For any feature that persists state (localStorage, IndexedDB, server persistence):
- **Required**: Semantic snapshot function capturing meaningful state
- **Required**: QA harness comparing JSON of semantic snapshots
- **Forbidden**: Raw DOM/HTML string comparisons for durability

### Principle 3: Acceptance Tests Are Living Contracts
Tests reflect the contract between BA (intent), PM (spec), and DEV (implementation). When tests are written against implementation details, the contract is fragile.

### Principle 4: QA Flakiness Is a Design Smell
If a test flakes intermittently (without code changes), it's a sign:
- Test is measuring implementation detail, not behavior
- Environmental factors (browser, timing, serialization) are affecting results
- **Action**: Refactor the test, not just add retries

---

## Governance Decisions Recorded

### Decision 1: Semantic Testing Standard (GOV-decision-durability-testing.md)
- **Approved**: All features with durability requirements must use semantic snapshots
- **Scope**: Effective FEATURE-002 onwards
- **Reversibility**: Yes (guidance only; no breaking changes)

### Decision 2: QA Testing Standards (QA-standards-semantic-testing.md)
- **Approved**: Codified anti-patterns and patterns for durability, formatting, undo/redo, export testing
- **Scope**: Reference guide for all future feature teams
- **Review Cycle**: Annually or after major framework/tooling changes

---

## What Changes for Future Features

### For BA (Problem Definition)
- No change to how success criteria are written
- But: SC must focus on **user intent** ("items survive reload"), not **implementation** ("localStorage string unchanged")

### For PM (Test Specification)
- When defining acceptance tests for durability/persistence:
  1. **Specify the semantic snapshot design** (what counts as "state"?)
  2. **Require semantic comparison** in QA script (not HTML strings)
  3. **Call out flakiness risks** in non-blocking issues
- Reference: `.ai/archive/FEATURE-001/QA-standards-semantic-testing.md` in handoff

### For DEV (Implementation)
- When building durability/persistence features:
  1. **Design a semantic snapshot function** (walk your data model, ignore serialization)
  2. **Expose it for QA** (internal, non-shipping: `window.__FEATURE_QA__.semanticSnapshot()`)
  3. **Document what is semantic vs artifact** in Dev_to_Gov handoff
- Reference: FEATURE-001 `window.__MVP_QA__.semanticSnapshotFromDom()` as example

### For GOV (Review & Approval)
- **Require semantic testing approach** in Dev_to_Gov approval for any persistence feature
- **Call out string-based durability assertions** as flakiness risks (Challenge if found)
- **Approve durability tests** only if they compare semantic state, not implementation
- **Document lessons** in archive and standards (this process)

---

## Metrics & Evidence

| Metric | Result |
|--------|--------|
| **Flakiness Before Fix** | 40% (2 FAIL/MIXED out of 5 runs) |
| **Flakiness After Fix** | 0% (3 consecutive PASS with semantic snapshots) |
| **False Negatives** | 0 (all actual data loss would still be caught) |
| **Adoption Path** | Codified in standards; applies to FEATURE-002+ |
| **Reversibility** | Yes (guidance only) |

---

## Post-Task Delta (What We Learned)

### Situation Type
Intermittent QA failure in durability testing; discovered root cause was test design, not implementation.

### What Surprised Us
1. **Browser serialization is non-deterministic**: Same semantic state can have different HTML representations after Reload. This is not a bug; it's expected behavior.
2. **Semantic snapshots are surprisingly simple**: Walking the data model and extracting meaning is more robust than trying to assert on DOM serialization.
3. **This pattern applies broadly**: Not just localStorage; same principle for API persistence, IndexedDB, any layer where state survives operations.

### Next Time Rules (for future features)

#### Rule 1: Test Intent, Not Details
**For acceptance testing**: Capture **semantic snapshots** (structured data) and compare meaning, not HTML strings.

**When to apply**: Any feature with durability, state preservation, or export.

#### Rule 2: Durability Requires Design
**For persistence features**: Don't bolt on QA afterward. Design the semantic snapshot function **upfront** (same as you'd design the data model).

**When to apply**: Before DEV begins; discuss in PM_to_Dev handoff.

#### Rule 3: Flakiness Is a Design Signal
**For QA strategy**: If a test flakes without code changes, investigate test design, not test conditions (retries, timeouts, environment).

**When to apply**: QA flakiness review in GOV approval.

---

## Archive & References

**Recorded Documents**:
- `GOV-decision-durability-testing.md` — Full decision with principle and implementation steps
- `QA-standards-semantic-testing.md` — Reusable standards and anti-patterns
- `gov-review.md` — Feature completion review (includes Post-Task Delta)

**For Future Teams**:
- Copy the semantic testing pattern from FEATURE-001
- Reference the QA standards document when defining durability tests
- Link FEATURE-001 in your PM_to_Dev / Dev_to_Gov if you have persistence requirements

---

## GOV Signature

**Approved By**: GOV (2025-12-21)  
**Status**: DOCUMENTED & BINDING for FEATURE-002 onwards  
**Impact**: Eliminates flaky durability tests; improves QA reliability across all features  

---

**Conclusion**: QA-006 flakiness is resolved. More importantly, the root cause (testing implementation details) is now addressed at the governance level. Future features will apply semantic testing from the start, preventing similar issues.
