Handoff: Dev_to_Gov
ID: FEATURE-001
Status: Approved
Owner: DEV
Mode: L1
Last updated: 2025-12-21
Links:
  Upstream: .ai/handoffs/PM_to_Dev.md
  Downstream: .ai/archive/FEATURE-001/gov-review.md

---

## Gate
- PM_to_Dev status is `Approved` — OK.
- DEV sub-handoffs are `Approved`:
  - `.ai/handoffs/Dev_FE_Layout.md`
  - `.ai/handoffs/Dev_Editor_Interaction.md`
  - `.ai/handoffs/Dev_Data_Export.md`

## 1) Summary (≤5 bullets)
- Implemented single-page three-pane layout (90+ / 30 / Minimum) with minimal nesting visuals and completion styling.
- Implemented keyboard-first editor interactions (create/edit/delete, indent/outdent, bold/italic, undo/redo).
- Implemented local durability (Reload + Reopen) via `localStorage` and 30-day markmap export with copy-out.
- Added deterministic QA helper for durability: `window.__MVP_QA__.semanticSnapshotFromDom()` to avoid flaky DOM `innerHTML` comparisons.

## 2) Changeset
- Files touched:
  - `my-todo/src/App.jsx`
  - `my-todo/src/App.css`
  - `my-todo/src/index.css`
  - `.ai/handoffs/Dev_FE_Layout.md`
  - `.ai/handoffs/Dev_Editor_Interaction.md`
  - `.ai/handoffs/Dev_Data_Export.md`
  - `.ai/handoffs/Dev_to_Gov.md`
- Interfaces changed (if any):
  - `window.__MVP_QA__.semanticSnapshotFromDom()` — additive (QA-only surface)
  - `localStorage["minimal-todo:v1"]` — additive (local persistence payload)

## 3) Acceptance Mapping (complete)
- AT-001: PASS — Evidence: UI renders three panes simultaneously (run `cd my-todo; npm run dev` and confirm 90+/30/Minimum visible).
- AT-002: PASS — Evidence: Keyboard-only create supported via `Enter` on `.listHost` and in-item.
- AT-003: PASS — Evidence: Keyboard-only edit supported via in-place `contentEditable` per item.
- AT-004: PASS — Evidence: Keyboard-only delete supported via `Backspace/Delete` on empty item; undo restores.
- AT-005: PASS — Evidence: `Tab` / `Shift+Tab` mutate DOM hierarchy; nested `ul.tree` renders indentation visuals.
- AT-006: PASS — Evidence: `Ctrl+B` / `Ctrl+I` toggles visible formatting for selection; caret-format typing renders immediately; stored as normalized HTML.
- AT-007: PASS — Evidence: Undo/redo via `Ctrl+Z` / `Ctrl+Y` across text edits + structural ops (delete/restore, indent/outdent); verified via manual QA steps.
- AT-008: PASS — Evidence: Minimum completion via checkbox toggle and `Ctrl+Enter`; visual strike/gray styling applied via CSS.
- AT-009: PASS — Evidence: `localStorage` persistence restores doc after Reload + Reopen; deterministic semantic snapshot helper available for harness validation.
- AT-010: PASS — Evidence: 30-day Export panel produces markmap-compatible bullet text; copy-out via Clipboard API (fallback manual copy from textarea).

## 4) Verification Steps (reproducible)
- VS-001: `cd my-todo; npm run dev` then open the local URL.
- VS-002: Run PM QA script QA-001..QA-006 and confirm expected behaviors.
- VS-003: Durability check: capture pre-reload snapshot via `window.__MVP_QA__.semanticSnapshotFromDom()`, Reload, re-run snapshot and compare JSON equality; repeat for Reopen.
- VS-004: Export check: add nested items in 30-day list, open Export, copy/paste into a markmap consumer; confirm hierarchy renders.

## 5) Edge Cases & Failure Modes (FM-###)
- FM-001: DOM serialization is unstable for boolean attributes / contenteditable artifacts — Handling: QA should compare semantic snapshot (text/hierarchy/completion/normalized HTML) rather than `innerHTML` equality; app exposes `window.__MVP_QA__.semanticSnapshotFromDom()`.
- FM-002: LocalStorage unavailable/quota exceeded — Handling: app continues in-memory (save errors are ignored); durability acceptance requires storage availability.

## 6) Risks & Rollback Notes (high level)
- RR-001: If persistence causes unexpected behavior, rollback by clearing `localStorage["minimal-todo:v1"]` and/or removing the persistence effect in `my-todo/src/App.jsx`.
- RR-002: Build environment warning: Vite warns Node 20.15.1 < 20.19; upgrade Node to avoid future toolchain breakage.

## 7) Deviations (must be explicit)
- DEV-SCOPE-001: Added QA helper `window.__MVP_QA__` to enable deterministic durability checks (no user-facing feature intent; supports QA correctness).

---

## Challenge / Response / Approval (append-only)

## Approval (GOV)
Approved:
- scope: Full MVP implementation across all acceptance tests (AT-001 through AT-010).
- evidence: All P0 gates (AT-002, AT-003, AT-004, AT-005, AT-006, AT-007, AT-009) pass. Non-P0 gates (AT-001, AT-008, AT-010) pass. Build succeeds. Reproducible QA steps confirmed.
- acceptance set: Three-pane always-visible layout + keyboard-first editor + undo/redo + formatting + completion + durability + export.
- drift check: 
  - ✓ No accounts / collaboration (NG-001)
  - ✓ No tags / filters / databases (NG-002)
  - ✓ No alternate views / rich blocks (NG-003)
  - No drift detected against charter.
- traceability:
  - BA SC-001..SC-008 → PM AT-001..AT-010 → DEV verification + evidence ✓
  - All SC/AT/Evidence chain is complete and testable.
- risk assessment (top 3):
  1. localStorage quota exceeded → Graceful degradation (in-memory, silent save failure); acceptable for MVP.
  2. Browser private mode → No persistence available; acceptable with user notice (future enhancement).
  3. Node.js version mismatch → Warning only; build succeeds; acceptable; recommend Node 20.19+ for future.

Notes:
- Implementation is production-ready for MVP release.
- QA hook `window.__MVP_QA__.semanticSnapshotFromDom()` enables deterministic durability assertions (not user-facing).
- localStorage persistence is stable; no data loss incidents detected.
- All three dev roles (FE Layout, Editor Interaction, Data Export) consolidated into unified React component (appropriate for single-page app).

## GOV Review Summary (Post-Task Delta)
- Situation type: MVP completion for FEATURE-001 (three-list personal task tool with keyboard-first interaction, formatting, undo/redo, durability, and export).
- What surprised us: 
  1. Combining three dev roles into a single component was more maintainable than splitting; monolithic React component appropriate for ~900 lines.
  2. Caret/selection preservation (using DOM path snapshot) solved a subtle UX issue with Ctrl+B/Ctrl+I immediately during typing.
- Next time rule (1): For keyboard-heavy editors, start with caret restoration as a first-class concern (not an afterthought); will improve iteration speed on formatting features.
