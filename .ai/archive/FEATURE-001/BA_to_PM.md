Handoff: BA_to_PM
ID: FEATURE-001
Status: Approved
Owner: BA
Mode: L2
Last updated: 2025-12-21
Links:
  Upstream: N/A
  Downstream: .ai/handoffs/PM_to_Dev.md

---

## 1) Product Intent (5 lines)
- Provide a calm, reliable “single page” for personal tasks (no accounts, no sharing).
- Make capture and re-organization feel instant, keyboard-first, and low-friction.
- Keep time horizons visible at once: 90+ days, 30 days, and “Minimum todo” (today’s floor).
- Support simple completion in “Minimum todo” so daily loops actually close.
- Stay intentionally anti-Notion: no databases, tags, multi-views, or rich blocks.

## 2) Target Usage Moments & “Success Feeling”
- Moment: Quick capture (idea/task appears) -> feeling: “Out of my head, instantly.”
- Moment: Start-of-day scan of Minimum todo -> feeling: “I know today’s floor.”
- Moment: Indent/outdent while thinking -> feeling: “It reshapes without friction.”
- Moment: Weekly review + export 30-day plan -> feeling: “My plan is current and portable (manual move between horizons is OK in v1).”

## 3) Problem Statement (≤5 bullets)
- PS-001: Tasks scatter across notes/apps, causing rework and missed follow-through.
- PS-002: Capture friction (context switches, formatting, over-structuring) prevents consistent daily use.
- PS-003: Existing tools invite complexity (tags/views/databases), which becomes maintenance instead of execution.
- PS-004: Without a “minimum” list, the day ends without closure and confidence.

## 4) Success Criteria (SC-###) - testable yes/no
- SC-001: The UI always shows three lists simultaneously: 90+ days, 30 days, Minimum todo.
- SC-002a (P0): A user can create a new item in any of the three lists using keyboard-only (no required mouse actions).
- SC-002b (P0): A user can edit item text in any of the three lists using keyboard-only (no required mouse actions).
- SC-002c (P0): A user can delete an item in any of the three lists using keyboard-only (no required mouse actions).
- SC-003 (P0): Tab indents and Shift+Tab outdents the current item, updating hierarchy correctly and preserving it after Reload and Reopen.
- SC-004 (P0): Ctrl+B toggles bold and Ctrl+I toggles italic for selected text (or at caret), and formatting persists after Reload and Reopen.
- SC-005 (P0): Ctrl+Z undoes and Ctrl+Y redoes both text edits and structural operations, including delete/restore and indent/outdent, with correct redo-after-undo.
- SC-006: In Minimum todo, an item can be completed (checkbox) and visually reflects completion (strike + gray).
- SC-007 (P0): Durability: after (1) Reload (browser refresh/reload) and (2) Reopen (close and reopen the page/tab/window), all lists retain items, hierarchy, completion, and minimal formatting with no changes.
- SC-008: 30-day list can be exported as markmap-compatible text and copied out for use elsewhere.

## 5) Success Metrics (Leading Indicators)
- SM-001: Capture frequency: # days/week with ≥1 new item added.
- SM-002: “Time-to-capture”: median time from opening app to first item created/edited.
- SM-003: Daily closure: % of days with ≥1 completion in Minimum todo.
- SM-004: Trust proxy: # “lost tasks/state” incidents (target: 0).

## 6) MVP Scope Boundaries (IN vs OUT) - match charter; emphasize anti-Notion
### IN (MVP)
- IN-001: Three always-visible lists: 90+ days / 30 days / Minimum todo.
- IN-002: Nested lists with keyboard-first editing, including indent/outdent.
- IN-003: Minimum todo supports checkbox completion with clear completed styling; deletion supported.
- IN-004: 30-day list export as markmap-compatible text (copyable output).
- IN-005: Durable local data so Reload + Reopen retains structure + completion state (and minimal formatting where used).
- IN-006 (P0): Keyboard shortcuts are acceptance-critical: Tab/Shift+Tab (indent/outdent), Ctrl+B/Ctrl+I (bold/italic), Ctrl+Z/Ctrl+Y (undo/redo incl. undo-after-delete and redo-after-undo).

### OUT (MVP) - “anti-Notion” guardrails
- OUT-001: Accounts, collaboration, sharing links, permissions.
- OUT-002: Tags/filters/databases/backlinks/templates, dashboards/analytics.
- OUT-003: Alternate views (kanban/calendar/timeline) and complex sorting/grouping.
- OUT-004: Rich blocks (images/tables/embeds) beyond minimal formatting.
- OUT-005: Reminders/notifications/automation/integrations; cloud sync.
- OUT-006: Built-in moving of items between horizons (90+ <-> 30 <-> Minimum) beyond manual copy/paste or re-create in v1.

## 6.1) Non-goals (NG-###) - explicit OUT (mirrors charter)
- NG-001: Collaboration/sharing/accounts/permissions.
- NG-002: Tags/filters/databases/backlinks/templates/dashboards (Notion-like system building).
- NG-003: Multi-view (kanban/calendar/timeline) or rich blocks beyond minimal formatting.

## 7) Key Product Decisions (and why)
- KD-001: Fixed 3-horizon layout (90+/30/Minimum) - reduces choice paralysis; makes review a habit, not a project.
- KD-002: Keyboard-first interaction - optimizes for speed of capture and reshaping thoughts in place.
- KD-003: Completion only emphasized in Minimum todo - reinforces “daily floor” behavior and prevents false precision elsewhere.
- KD-004: Minimal formatting (bold/italic only) - prevents rich-content drift and keeps focus on action.
- KD-005: Local durability as a non-negotiable - trust is prerequisite to habit; reliability beats extensibility.
- KD-006: Markmap text export for 30-day - portability without building more views.

## 8) Constraints (C-###) & Assumptions (A-###)
### Constraints (from charter)
- C-001: Single-user personal use only.
- C-002: Minimal formatting only: bold + italic.
- C-003: Avoid scope expansion unless explicitly approved and recorded.
- C-004: Prefer simplest product shape that meets acceptance.

### Assumptions (explicit)
- A-001: “Minimum todo” is the only list that must support checkbox completion in MVP.
- A-002: Cross-horizon move is NOT required in v1; acceptable workaround is manual copy/paste or re-create.
- A-003: Export output is plain text that is acceptable if it renders correctly in markmap consumers.

## 9) Options (A/B) - no implementation detail
### Option A (Chosen): Fixed 3 lists with strict scope boundaries
- Pros: Matches charter; simple mental model; low drift risk.
- Cons: Less flexible for varied workflows.

### Option B: Customizable sections / additional organization primitives
- Trade-off: More flexible, but pushes toward Notion-like complexity (conflicts with charter trade-offs).

## 10) Top Risks & Mitigations
- R-001: Scope drift toward tags/views/databases - Mitigation: enforce OUT list + drift alarms; require explicit decision record for changes.
- R-002: Reliability failure (data loss/state reset) breaks trust - Mitigation: treat SC-007 as P0; use a repeatable Reload + Reopen QA script.
- R-003: Keyboard flow is incomplete (missing required shortcuts) -> Mitigation: treat SC-003/SC-004/SC-005 as P0; block MVP release until pass.

## 11) MVP Milestone Definition + Explicit “NOT in v1”
### Milestone (Definition-of-Done)
- M-001: Three horizons work end-to-end for daily capture + review with keyboard-first editing.
- M-002: P0 keyboard shortcuts pass: Tab/Shift+Tab; Ctrl+B/Ctrl+I; Ctrl+Z/Ctrl+Y (incl. undo-after-delete and redo-after-undo).
- M-003: Minimum todo completion works and persists; Reload + Reopen does not lose structure/state/formatting.
- M-004: 30-day export produces markmap-compatible text and is copyable.

### NOT in v1 (explicit)
- NV1-001: Tags, filters, search, advanced sorting/grouping.
- NV1-002: Multiple pages/workspaces, templates-as-a-system, dashboards/analytics.
- NV1-003: Collaboration, accounts, sharing, permissions, cloud sync.
- NV1-004: Alternate views (calendar/kanban/timeline), reminders/notifications, automation/integrations.
- NV1-005: Rich block content (images/tables/embeds) or deep customization/theming.
- NV1-006: Built-in cross-horizon move (90+ <-> 30 <-> Minimum) beyond manual copy/paste or re-create.

## 12) Drift Check - off-track if...
- DC-001: Requests introduce “organize everything” mechanics (tags/databases/views/backlinks/templates).
- DC-002: MVP work prioritizes extensibility/platform concerns over reliability and capture speed.
- DC-003: Any proposal adds accounts/collaboration before proving daily habit + data trust.

## 13) Open Questions (blocking only; max 5)
- None.

## 13.1) Issues (process)
- ID: I-001
  - Type: Blocking
  - Statement: Handoff file locations in `AGENTS.md` differ from repo path usage (`.ai/BA_to_PM.md` vs `.ai/handoffs/BA_to_PM.md`).
  - Evidence: `AGENTS.md` “Single active feature” working handoff paths vs presence of `.ai/handoffs/`.
  - Proposal: Confirm canonical working-handoff paths for this repo and standardize the set accordingly.
  - Owner: PM
  - Status: Resolved

## 14) GitHub Issue Breakdown (Title + Description + AC + Dependencies + Effort + Owner role)
- Issue: Define acceptance contract (SC/OUT/Drift) for MVP
  - Description: Convert BA SC/OUT into PM acceptance tests with full traceability.
  - AC: PM_to_Dev maps AT-### to every SC-### (including all P0 keyboard shortcuts); OUT list mirrored verbatim.
  - Dependencies: This BA_to_PM approved.
  - Effort: S
  - Owner role: PM

- Issue: FE layout P0 - three-list always-visible layout
  - Description: Ensure three horizons are always visible with clear labels and no extra horizons are introduced.
  - AC: SC-001 satisfied; no extra sections/horizons added.
  - Dependencies: None.
  - Effort: M
  - Owner role: DEV - FE Layout

- Issue: Editor interaction P0 - keyboard-first baseline
  - Description: Ensure core create/edit/delete actions are possible without mouse across all three lists.
  - AC: SC-002a, SC-002b, and SC-002c satisfied.
  - Dependencies: FE layout P0 - three-list always-visible layout.
  - Effort: L
  - Owner role: DEV - Editor Interaction

- Issue: Editor interaction P0 - hierarchy shortcuts
  - Description: Support hierarchy editing via keyboard shortcuts.
  - AC: SC-003 satisfied; Tab indents and Shift+Tab outdents; hierarchy persists after Reload and Reopen.
  - Dependencies: Editor interaction P0 - keyboard-first baseline.
  - Effort: M
  - Owner role: DEV - Editor Interaction

- Issue: Editor interaction P0 - minimal formatting shortcuts
  - Description: Support minimal formatting via keyboard shortcuts.
  - AC: SC-004 satisfied; Ctrl+B/Ctrl+I toggles bold/italic; formatting persists after Reload and Reopen.
  - Dependencies: Editor interaction P0 - keyboard-first baseline.
  - Effort: M
  - Owner role: DEV - Editor Interaction

- Issue: Editor interaction P0 - undo/redo correctness
  - Description: Support undo/redo across edits and destructive actions.
  - AC: SC-005 satisfied; Ctrl+Z/Ctrl+Y covers text edits and structural ops (at least delete/restore and indent/outdent), including correct redo-after-undo.
  - Dependencies: Editor interaction P0 - keyboard-first baseline.
  - Effort: M
  - Owner role: DEV - Editor Interaction

- Issue: Minimum todo completion behavior and visuals
  - Description: Enable completion in Minimum todo with clear visual state.
  - AC: SC-006 satisfied.
  - Dependencies: FE layout P0 - three-list always-visible layout.
  - Effort: M
  - Owner role: DEV - FE Layout

- Issue: Data export P0 - persisted state contract
  - Description: Define the minimum persisted state that must survive Reload and Reopen.
  - AC: The contract covers at least: items in all lists, hierarchy, completion state, and minimal formatting; it maps directly to SC-007 and QA steps.
  - Dependencies: This BA_to_PM approved.
  - Effort: S
  - Owner role: DEV - Data Export

- Issue: Data export P0 - durability (Reload + Reopen persistence)
  - Description: Ensure durability so Reload and Reopen preserve state defined in the persisted state contract.
  - AC: SC-007 satisfied; Demo / QA script passes.
  - Dependencies: Data export P0 - persisted state contract.
  - Effort: M
  - Owner role: DEV - Data Export

- Issue: 30-day markmap-compatible export
  - Description: Export 30-day list as markmap-compatible text.
  - AC: SC-008 satisfied; output renders in a markmap consumer.
  - Dependencies: FE layout P0 - three-list always-visible layout.
  - Effort: S
  - Owner role: DEV - Data Export

---

## Challenge / Response / Approval (append-only)

## 15) Demo / QA Script (P0, reproducible)
- QA-001: Create at least 3 items in each list; verify SC-001 remains true throughout.
- QA-002: Use Tab and Shift+Tab to indent/outdent; confirm hierarchy changes and matches expectations (SC-003).
- QA-003: Apply Ctrl+B and Ctrl+I to text; confirm bold/italic toggles and remains visible (SC-004).
- QA-004: Make one item bold/italic, then delete it; press Ctrl+Z to restore it (including its formatting) to the same list position/hierarchy; press Ctrl+Y to re-delete (SC-005).
- QA-005: Complete one Minimum todo item; confirm strike + gray styling (SC-006).
- QA-006: Reload (browser refresh/reload), then Reopen (close and reopen page/tab/window); confirm items, hierarchy, completion, and formatting are unchanged (SC-007).

## Approval (PM)
Approved:
- scope: FEATURE-001 MVP problem contract
- acceptance set: SC-001 through SC-008 (including SC-002a/SC-002b/SC-002c)
Notes:
- I-001: For this repo, canonical working-handoff paths are under `.ai/handoffs/` (AGENTS.md path examples to be reconciled separately).
