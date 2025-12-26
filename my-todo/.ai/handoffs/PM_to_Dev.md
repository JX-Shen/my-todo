Handoff: PM_to_Dev
ID: FEATURE-003
Status: Approved
Owner: PM
Mode: L2
Last updated: 2025-09-06
Links:
  Upstream: .ai/handoffs/BA_to_PM.md
  Downstream: .ai/handoffs/Dev_to_Gov.md

---

## Gate
- If BA_to_PM status != Approved: Challenge BA_to_PM and STOP.

## 1) Scope
### In-scope (S-###)
- S-001: Define canonical app state format { version, updatedAt, todos, meta } for export/import.
- S-002: Add UI controls for Export JSON, Import JSON, Backup now, and backup history with restore.
- S-003: Validate import schema, show friendly errors, and warn on older updatedAt with confirmation override.
- S-004: Maintain last 30 snapshots in IndexedDB (preferred) or localStorage fallback with size checks.
- S-005: Update README with backup/export/import guidance and future Supabase migration notes.

### Out-of-scope (OOS-###) — must mirror BA Non-goals
- OOS-001: Cloud sync, multi-user support, or authentication.
- OOS-002: Encrypted or password-protected backups.
- OOS-003: Changes to core todo features unrelated to backup/restore.
- OOS-004: Automatic scheduled backups beyond snapshot logic.

## 2) Acceptance Tests (AT-###) — MUST map to BA SC-###
- AT-001 -> SC-001: Export generates JSON matching schema and filename format todo-backup-YYYYMMDD-HHmmss.json.
- AT-002 -> SC-002: Import rejects invalid schema with clear error messaging to user.
- AT-003 -> SC-003: Import of older updatedAt shows warning and requires confirmation to proceed.
- AT-004 -> SC-004: App stores max 30 snapshots, lists them in UI, and can restore a selected snapshot.
- AT-005 -> SC-005: README includes export/import steps, backup storage location, and Supabase migration notes.

## 3) Deliverables (D-###)
- D-001: Updated UI with export/import/backup controls and backup list panel.
- D-002: Snapshot storage logic with 30-entry retention policy.
- D-003: README documentation updates.
- D-004: Dev_to_Gov filled with AT evidence.

## 4) Milestones (max 3)
- M1: Implement export/import + schema validation + warning flow.
- M2: Implement snapshot storage + history UI + restore.
- M3: Update README + Dev_to_Gov evidence.

## 5) Risks (R-###) & Mitigations
- R-001: Storage quota exceeded in localStorage fallback — Mitigation: size checks and graceful error.
- R-002: User confusion on import warnings — Mitigation: explicit warning copy and confirmation.

## 6) Rollout / Verification Plan (high level)
- RV-001: Manual smoke test export/import/restore in browser.
- RV-002: Verify snapshot retention cap at 30.

## 7) Issues (optional)

---

## Challenge / Response / Approval (append-only)

## Approval (PM)
Approved:
- scope: S-001..S-005
- acceptance set: AT-001..AT-005
Notes:
- Ready for DEV implementation.
