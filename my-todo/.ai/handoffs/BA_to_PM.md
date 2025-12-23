Handoff: BA_to_PM
ID: FEATURE-003
Status: Approved
Owner: BA
Mode: L2
Last updated: 2025-09-06
Links:
  Upstream: N/A
  Downstream: .ai/handoffs/PM_to_Dev.md

---

## 1) North Star (1 sentence)
Enable users to safely export, import, and restore their todo data with clear safeguards and local history.

## 2) User & Context
- Primary user: Single-user todo app user managing tasks locally in the browser.
- Usage moment(s): Before device changes, after accidental deletion, or as routine backup.
- Current workflow: No built-in backup/restore; data is only in browser storage.
- Pain: Risk of data loss and no easy way to migrate or recover.

## 3) Problem Statement (≤5 bullets)
- PS-001: Users cannot export their current todo state for offline backup.
- PS-002: Users cannot import a JSON backup with validation or conflict warnings.
- PS-003: Users lack an in-app history of recent snapshots to restore from.

## 4) Success Criteria (SC-###) — testable yes/no
- SC-001: The app can export a JSON file with schema { version, updatedAt, todos, meta } and a timestamped filename.
- SC-002: The app can import a JSON file and rejects invalid schema with a user-friendly error.
- SC-003: If imported updatedAt is older than current state, the app warns and allows a confirmed force import.
- SC-004: The app maintains up to 30 local snapshots and provides a UI to restore any snapshot.
- SC-005: README documents export/import, storage location for backups, and migration notes for future Supabase sync.

## 5) Non-goals (NG-###)
- NG-001: No cloud sync or multi-device backup in this feature.
- NG-002: No authentication or user accounts.
- NG-003: No encryption or password-protected backups.
- NG-004: No automatic periodic backups beyond the defined snapshot behavior.
- NG-005: No changes to todo feature set unrelated to backup/restore.

## 6) Constraints (C-###)
- C-001: Must work in-browser using IndexedDB preferred, with localStorage fallback.
- C-002: Keep UI additions minimal and consistent with existing app layout.

## 7) Assumptions (A-###)
- A-001: Existing app state can be serialized to JSON and restored without data loss.
- A-002: Browser storage limits are sufficient for 30 snapshots of typical todo data.

## 8) Options (A/B) — no implementation detail
### Option A:
- Pros: In-app JSON export/import plus local snapshot history provides full recovery.
- Cons: Added UI complexity and storage management needs.
- Risks: Storage quota issues or user confusion on import warnings.

### Option B:
- Pros: Export/import only, minimal UI.
- Cons: No local restore history; higher risk of data loss.
- Risks: Users lose snapshots unless they manually manage files.

## 9) Drift Check — off-track if...
- DC-001: Scope expands to multi-user sync or cloud storage.
- DC-002: Backup/restore changes core todo workflows beyond necessary UI.

## 10) Open Questions (Q-###) — max 5
- Q-001: What is the current persistence layer for todos (localStorage vs IndexedDB)?
- Q-002: Are there existing UI patterns for secondary panels or settings?

## 11) Issues (optional)
- ID: I-001
  Type: Non-blocking
  Statement: Confirm preferred storage location for snapshots (IndexedDB vs localStorage fallback).
  Evidence: C-001
  Proposal: Inspect current storage implementation to choose primary storage.
  Owner: BA
  Status: Open

---

## Challenge / Response / Approval (append-only)

## Approval (BA)
Approved:
- scope: Export/import JSON with backup history and UI controls per SC-001..SC-005.
- acceptance set: SC-001..SC-005
Notes:
- Self-approval to unblock PM handoff.

## Approval (PM)
Approved:
- scope: Backup/export/import with local snapshot history per SC-001..SC-005.
- acceptance set: SC-001..SC-005
Notes:
- Proceed to PM_to_Dev execution contract.
