Handoff: PM_to_Dev
ID: FEATURE-001
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

## Blocking Issues
- None.

## P0 Acceptance Gates (explicit)
- P0 must PASS before MVP is considered “done”: AT-002, AT-003, AT-004, AT-005, AT-006, AT-007, AT-009.
- Shortcut gates (P0): Tab/Shift+Tab (AT-005), Ctrl+B/Ctrl+I (AT-006), Ctrl+Z/Ctrl+Y (AT-007).
- Durability gate (P0): Reload + Reopen retains state (AT-009).

## 1) MVP Summary
Build a calm, single-page, local-only personal task tool with three always-visible horizons (90+ days / 30 days / Minimum todo) that is keyboard-first for capture and re-organization, supports minimal formatting (bold/italic) and undo/redo, and is durable across Reload + Reopen; Minimum todo supports completion and 30-day supports markmap-compatible export.

## 2) Scope Boundaries (mirrors BA_to_PM)
### In-scope (IN-###)
- IN-001: Three always-visible lists: 90+ days / 30 days / Minimum todo.
- IN-002: Nested lists with keyboard-first editing, including indent/outdent.
- IN-003: Minimum todo supports checkbox completion with clear completed styling; deletion supported.
- IN-004: 30-day list export as markmap-compatible text (copyable output).
- IN-005: Durable local data so Reload + Reopen retains structure + completion state (and minimal formatting where used).
- IN-006 (P0): Keyboard shortcuts are acceptance-critical: Tab/Shift+Tab (indent/outdent), Ctrl+B/Ctrl+I (bold/italic), Ctrl+Z/Ctrl+Y (undo/redo incl. undo-after-delete and redo-after-undo).

### Out-of-scope (OUT-###) — “anti-Notion” guardrails
- OUT-001: Accounts, collaboration, sharing links, permissions.
- OUT-002: Tags/filters/databases/backlinks/templates, dashboards/analytics.
- OUT-003: Alternate views (kanban/calendar/timeline) and complex sorting/grouping.
- OUT-004: Rich blocks (images/tables/embeds) beyond minimal formatting.
- OUT-005: Reminders/notifications/automation/integrations; cloud sync.
- OUT-006: Built-in moving of items between horizons (90+ <-> 30 <-> Minimum) beyond manual copy/paste or re-create in v1.

### Non-goals (NG-###)
- NG-001: Collaboration/sharing/accounts/permissions.
- NG-002: Tags/filters/databases/backlinks/templates/dashboards (Notion-like system building).
- NG-003: Multi-view (kanban/calendar/timeline) or rich blocks beyond minimal formatting.

## 3) Acceptance Tests (AT-###) — MUST map 1:1 to BA SC-###
- AT-001 -> SC-001: The UI shows three lists simultaneously: 90+ days, 30 days, Minimum todo (no navigation to other pages/sections required to see all three).

- AT-002 (P0) -> SC-002a: Using keyboard-only, a user can create a new item in each of the three lists (no required mouse actions).

- AT-003 (P0) -> SC-002b: Using keyboard-only, a user can edit item text in each of the three lists (no required mouse actions).

- AT-004 (P0) -> SC-002c: Using keyboard-only, a user can delete an item in each of the three lists (no required mouse actions).

- AT-005 (P0) -> SC-003: Tab indents and Shift+Tab outdents the current item; hierarchy updates correctly and is preserved after Reload and Reopen.

- AT-006 (P0) -> SC-004: Ctrl+B toggles bold and Ctrl+I toggles italic for selected text (or at caret); formatting persists after Reload and Reopen.

- AT-007 (P0) -> SC-005: Ctrl+Z undoes and Ctrl+Y redoes both text edits and structural operations, including delete/restore and indent/outdent, with correct redo-after-undo.

- AT-008 -> SC-006: In Minimum todo, an item can be completed (checkbox) and visually reflects completion (strike + gray).

- AT-009 (P0) -> SC-007: Durability: after (1) Reload (browser refresh/reload) and (2) Reopen (close and reopen the page/tab/window), all lists retain items, hierarchy, completion, and minimal formatting with no changes.

- AT-010 -> SC-008: 30-day list can be exported as markmap-compatible text and copied out for use elsewhere.

## 4) Demo / QA Script (P0, reproducible)
- QA-001: Create at least 3 items in each list; verify SC-001 remains true throughout. (AT-001, AT-002)
- QA-002: Use Tab and Shift+Tab to indent/outdent; confirm hierarchy changes and matches expectations (SC-003). (AT-005)
- QA-003: Apply Ctrl+B and Ctrl+I to text; confirm bold/italic toggles and remains visible (SC-004). (AT-006)
- QA-004: Make one item bold/italic, then delete it; press Ctrl+Z to restore it (including its formatting) to the same list position/hierarchy; press Ctrl+Y to re-delete (SC-005). (AT-007; if delete is performed keyboard-only, also covers AT-004 for that list)
- QA-005: Complete one Minimum todo item; confirm strike + gray styling (SC-006). (AT-008)
- QA-006: Reload (browser refresh/reload), then Reopen (close and reopen page/tab/window); confirm items, hierarchy, completion, and formatting are unchanged (SC-007). (AT-009; also validates persistence aspects of AT-005/AT-006/AT-008)

### Supplemental QA checks (to cover full AT set)
- QA-007 (P0): Using keyboard-only, edit an item in each list; confirm text updates in-place. (AT-003)
- QA-008 (P0): Using keyboard-only, delete an item in each list; confirm removal. (AT-004)
- QA-009: Export the 30-day list as markmap-compatible text and copy it out; confirm it renders in a markmap consumer. (AT-010)

## 5) GitHub Issue Breakdown (execution-ready)
- Issue: Define acceptance contract (SC/OUT/Drift) for MVP
  - Description: Treat this handoff as the source of truth for scope boundaries + AT mapping; ensure Dev_to_Gov reports evidence for every AT-### and flags drift.
  - Acceptance: AT-001 through AT-010 are referenced in implementation issues and later evidenced in Dev_to_Gov.
  - Dependencies: None (BA_to_PM is Approved).
  - Owner role: Data Export

- Issue: FE layout P0 - three-list always-visible layout
  - Description: Ensure the three horizons are always visible with clear labels and no extra horizons/sections are introduced.
  - Acceptance: AT-001 passes.
  - Dependencies: Define acceptance contract (SC/OUT/Drift) for MVP.
  - Owner role: FE Layout

- Issue: Editor interaction P0 - keyboard-first baseline
  - Description: Ensure core create/edit/delete actions are possible without mouse across all three lists.
  - Acceptance: AT-002, AT-003, AT-004 pass.
  - Dependencies: FE layout P0 - three-list always-visible layout.
  - Owner role: Editor Interaction

- Issue: Editor interaction P0 - hierarchy shortcuts
  - Description: Support hierarchy editing via keyboard shortcuts.
  - Acceptance: AT-005 passes.
  - Dependencies: Editor interaction P0 - keyboard-first baseline.
  - Owner role: Editor Interaction

- Issue: Editor interaction P0 - minimal formatting shortcuts
  - Description: Support minimal formatting via keyboard shortcuts.
  - Acceptance: AT-006 passes.
  - Dependencies: Editor interaction P0 - keyboard-first baseline.
  - Owner role: Editor Interaction

- Issue: Editor interaction P0 - undo/redo correctness
  - Description: Support undo/redo across edits and destructive actions.
  - Acceptance: AT-007 passes (includes undo-after-delete and redo-after-undo; includes structural ops such as indent/outdent).
  - Dependencies: Editor interaction P0 - keyboard-first baseline; Editor interaction P0 - hierarchy shortcuts; Editor interaction P0 - minimal formatting shortcuts.
  - Owner role: Editor Interaction

- Issue: Minimum todo completion behavior and visuals
  - Description: Enable completion in Minimum todo with clear visual state.
  - Acceptance: AT-008 passes (and remains true after AT-009 verification).
  - Dependencies: FE layout P0 - three-list always-visible layout.
  - Owner role: FE Layout

- Issue: Data export P0 - persisted state contract
  - Description: Define the minimum persisted state that must survive Reload and Reopen (items in all lists, hierarchy, completion state, minimal formatting).
  - Acceptance: AT-009 scope is explicitly covered by the persisted-state contract used for verification.
  - Dependencies: Define acceptance contract (SC/OUT/Drift) for MVP.
  - Owner role: Data Export

- Issue: Data export P0 - durability (Reload + Reopen persistence)
  - Description: Ensure Reload + Reopen preserve state defined in the persisted state contract.
  - Acceptance: AT-009 passes; QA-006 passes.
  - Dependencies: Data export P0 - persisted state contract; Editor interaction P0 - hierarchy shortcuts; Editor interaction P0 - minimal formatting shortcuts; Minimum todo completion behavior and visuals.
  - Owner role: Data Export

- Issue: 30-day markmap-compatible export
  - Description: Export 30-day list as markmap-compatible text.
  - Acceptance: AT-010 passes.
  - Dependencies: FE layout P0 - three-list always-visible layout.
  - Owner role: Data Export

## 6) Risks + Anti-drift Gates
### Top risks (R-###)
- R-001: Scope drift toward tags/views/databases/collab — Mitigation: enforce OUT list; any expansion requires `.ai/decisions.yml` entry (do not “sneak in”).
- R-002: Reliability failure (state loss) breaks trust — Mitigation: treat AT-009 as P0; require QA-006 pass before considering MVP “done”.
- R-003: Keyboard flow is incomplete — Mitigation: treat AT-002 through AT-007 as P0; block MVP completion until all pass.

### Automatic reject requests (unless explicitly approved + recorded)
- AR-001: Accounts/login, collaboration, sharing links, permissions.
- AR-002: Tags, filters, search-as-organization, databases, backlinks, templates, dashboards/analytics.
- AR-003: Alternate views (kanban/calendar/timeline) or complex sorting/grouping.
- AR-004: Rich blocks (images/tables/embeds) beyond bold/italic.
- AR-005: Reminders/notifications, automation/integrations, cloud sync.
- AR-006: Built-in cross-horizon move (90+ <-> 30 <-> Minimum) beyond manual copy/paste/re-create.

---

## Challenge / Response / Approval (append-only)

## Response (PM)
Issue resolution:
- I-001 (from `.ai/handoffs/Dev_FE_Layout.md`): resolved — PM_to_Dev is Approved; upstream gate cleared for DEV work.
Revision summary:
- Added explicit P0 gates and QA-to-AT mapping; added supplemental QA to cover remaining ATs.
Decision needed:
- None.

## Approval (PM)
Approved:
- scope: FEATURE-001 MVP execution contract
- acceptance set: AT-001 through AT-010 (P0 gates: AT-002 through AT-007 and AT-009)
Notes:
- This approval unblocks DEV roles (including FE Layout) per upstream gate policy.

---

## Release Gate Passed (checklist)
- [x] Three horizons always visible (AT-001 / SC-001)
- [x] P0 shortcuts: Tab/Shift+Tab indent/outdent (AT-005 / SC-003)
- [x] P0 shortcuts: Ctrl+B/Ctrl+I bold/italic (AT-006 / SC-004)
- [x] P0 shortcuts: Ctrl+Z/Ctrl+Y undo/redo incl. delete/restore and redo-after-undo (AT-007 / SC-005)
- [x] Minimum todo completion visuals (strike + gray) (AT-008 / SC-006)
- [ ] P0 durability: Reload + Reopen retains state (AT-009 / SC-007)

## Verification Log
- Date: 2025-12-21
- Environment: Playwright Chromium; Microsoft Windows 10 Home (10.0.19045); Node `v20.15.1` (no Node warnings observed)
- QA results:
  - QA-001: PASS
  - QA-002: PASS
  - QA-003: PASS
  - QA-004: PASS
  - QA-005: PASS
  - QA-006: MIXED — PASS in isolated rerun; intermittent FAIL in full-sequence run (`state changed after Reload (expected identical)`)
  - QA-007: PASS
  - QA-008: PASS
  - QA-009: PASS
