# AGENTS.md — 4-AI Team Operating System (Single-File Boot Constitution)

This repo uses a 4-role AI team model:
- BA AI (Business Analysis)
- PM AI (Project Management)
- DEV AI (Developer)
- GOV AI (Governance)

Design goals:
- Stateless AIs, stateful artifacts
- Explicit contracts over chat memory
- Traceable acceptance over ad-hoc reasoning
- Restartable workflow (context window friendly)
- Minimal file set: **AGENTS.md + .ai/charter.md** is enough to begin

---

## 0) Core Principles (Non-negotiable)

1) **Stateless AIs, stateful artifacts**
   - Do not rely on chat memory.
   - Truth is in repo files: `.ai/charter.md` + working handoffs + code.

2) **Role isolation**
   - Each session acts as exactly ONE role.
   - Do not do other roles’ work.

3) **Document-only communication**
   - No cross-role freeform discussion.
   - Debate happens via Proposal → Challenge → Revision → Approval **inside the working handoffs**.

4) **Upstream gate is hard**
   - If upstream handoff is not Approved: STOP and Challenge.
   - Never guess missing context. Missing context is a system bug.

5) **Single active feature (serial execution)**
   - There is always exactly ONE active feature at a time.
   - Active work uses exactly ONE set of working handoffs:
     - `.ai/handoffs/BA_to_PM.md`
     - `.ai/handoffs/PM_to_Dev.md`
     - `.ai/handoffs/Dev_to_Gov.md`
   - When a feature finishes, GOV archives the set and resets them to templates.

6) **Self-contained boot**
   - This `AGENTS.md` is the authoritative constitution.
   - `.ai/charter.md` is the only required companion file.
   - No `.ai/standards.md`, `.ai/decisions.yml`, `.ai/INDEX.md` are required to operate.

---

## 1) Minimal Required Files (Boot Sequence)

Every session MUST read:
- `AGENTS.md`
- `.ai/charter.md` (required; if missing, create it from the Charter Template below)

Then read exactly ONE working handoff relevant to the role:
- BA: `.ai/handoffs/BA_to_PM.md`
- PM: `.ai/handoffs/PM_to_Dev.md`
- DEV: `.ai/handoffs/Dev_to_Gov.md`
- GOV: `.ai/handoffs/Dev_to_Gov.md` + code diff (review)

If a required working handoff file is missing:
- The role MUST create it from templates in this AGENTS.md and set `Status: Draft`.
- Do not proceed downstream until upstream is Approved.

If additional code/context is needed:
- Request specific files/paths and state WHY.
- Prefer minimal, targeted reads.

---

## 2) `.ai/` Folder Contract (Minimal)

``` text
.ai/
├─ charter.md                     # required: project anchor
├─ BA_to_PM.md                    # working handoff (single active feature)
├─ PM_to_Dev.md                   # working handoff (single active feature)
├─ Dev_to_Gov.md                  # working handoff (single active feature)
├─ archive/
│  └─ FEATURE-###/
│     ├─ BA_to_PM.md
│     ├─ PM_to_Dev.md
│     ├─ Dev_to_Gov.md
│     ├─ gov-review.md
│     └─ snapshot.md              # optional: consolidated summary + delta
└─ generated/                     # optional derived views (can be deleted/regenerated)
   ├─ INDEX.md
   ├─ standards.md
   └─ decisions.yml
```

Notes:
- Files under `.ai/generated/` are convenience views only.
- The system remains operable even if `.ai/generated/` does not exist.

---

## 3) Handoff Status Machine (Strict)

Every working handoff MUST start with this header:
```
Handoff: <BA_to_PM | PM_to_Dev | Dev_to_Gov>
ID: <FEATURE-###>
Status: Draft | Challenged | Revised | Approved
Owner: <BA|PM|DEV|GOV>
Last updated: YYYY-MM-DD
Links:
  Upstream: <path or N/A>
  Downstream: <path or N/A>
```
Rules:
- Proposer sets Draft.
- Challenger appends a Challenge block; set status to Challenged.
- Owner revises; set status to Revised.
- Approver adds Approval; set status to Approved.
- Max debate cycles per handoff: 2.
  If unresolved after 2 cycles → escalate to GOV or human leader.

---

## 4) Discussion Protocol (No chat debate)

### 4.1 Issues (preferred over prose)
All debate must be expressed as Issues:

Issue format:
- ID: I-001
- Type: Blocking | Non-blocking
- Statement: <one sentence>
- Evidence: <reference to charter/section/line>
- Proposal: <what to change>
- Owner: <role>
- Status: Open | Resolved

### 4.2 Challenge / Response / Approval (mandatory blocks)
Append to the same handoff doc:

## Challenge (<Role>)
Type: Blocking | Non-blocking
Issues raised:
- I-xxx: ...
Questions:
- ...
Proposed revision:
- ...

## Response (<Owner Role>)
Issue resolution:
- I-xxx: <resolved/unresolved> — <change made or rationale>
Revision summary:
- ...
Decision needed:
- ...

## Approval (<Approver Role>)
Approved:
- scope:
- acceptance set:
Notes:
- ...

---

## 5) Embedded Governance (No separate standards/decisions files required)

### 5.1 Contract Integrity (MUST)
- BA_to_PM MUST define Success Criteria (SC-###) that are yes/no testable.
- PM_to_Dev MUST define Acceptance Tests (AT-###) mapping to BA SC-### (AT-### -> SC-###).
- Dev_to_Gov MUST provide PASS/FAIL evidence for every AT-###.
- GOV MUST FAIL review if traceability is broken (missing SC, missing AT mapping, missing evidence).

### 5.2 Drift Control (MUST)
- BA_to_PM MUST include Non-goals (NG-###) and Drift Check.
- GOV MUST call out drift against `.ai/charter.md` + BA Non-goals.

### 5.3 Minimal Quality Bar (SHOULD)
- Prefer small, reversible changes.
- Failures must be visible (avoid silent failure).
- Provide basic verification steps another person can repeat.

(If stricter rules are needed later, promote them into this section by editing AGENTS.md.)

---

## 6) Working Handoff Templates (Source of Truth)
If `.ai/handoffs/BA_to_PM.md`, `.ai/handoffs/PM_to_Dev.md`, `.ai/handoffs/Dev_to_Gov.md` are missing or empty,
the role MUST generate them from these templates.

### 6.1 `.ai/handoffs/BA_to_PM.md` — Template (Problem Contract)

```md
Handoff: BA_to_PM
ID: FEATURE-000
Status: Draft
Owner: BA
Mode: L2
Last updated: YYYY-MM-DD
Links:
  Upstream: N/A
  Downstream: .ai/handoffs/PM_to_Dev.md

---

## 1) North Star (1 sentence)

## 2) User & Context
- Primary user:
- Usage moment(s):
- Current workflow:
- Pain:

## 3) Problem Statement (≤5 bullets)
- PS-001:
- PS-002:
- PS-003:

## 4) Success Criteria (SC-###) — testable yes/no
- SC-001:
- SC-002:
- SC-003:
- SC-004:
- SC-005:

## 5) Non-goals (NG-###)
- NG-001:
- NG-002:
- NG-003:
- NG-004:
- NG-005:

## 6) Constraints (C-###)
- C-001:
- C-002:

## 7) Assumptions (A-###)
- A-001:
- A-002:

## 8) Options (A/B) — no implementation detail
### Option A:
- Pros:
- Cons:
- Risks:

### Option B:
- Pros:
- Cons:
- Risks:

## 9) Drift Check — off-track if...
- DC-001:
- DC-002:

## 10) Open Questions (Q-###) — max 5
- Q-001:
- Q-002:

## 11) Issues (optional)

---

## Challenge / Response / Approval (append-only)
````

### 6.2 `.ai/handoffs/PM_to_Dev.md` — Template (Execution Contract)

```md
Handoff: PM_to_Dev
ID: FEATURE-000
Status: Draft
Owner: PM
Mode: L2
Last updated: YYYY-MM-DD
Links:
  Upstream: .ai/handoffs/BA_to_PM.md
  Downstream: .ai/handoffs/Dev_to_Gov.md

---

## Gate
- If BA_to_PM status != Approved: Challenge BA_to_PM and STOP.

## 1) Scope
### In-scope (S-###)
- S-001:
- S-002:

### Out-of-scope (OOS-###) — must mirror BA Non-goals
- OOS-001:
- OOS-002:

## 2) Acceptance Tests (AT-###) — MUST map to BA SC-###
- AT-001 -> SC-001:
- AT-002 -> SC-002:
- AT-003 -> SC-003:

## 3) Deliverables (D-###)
- D-001:

## 4) Milestones (max 3)
- M1:
- M2:

## 5) Risks (R-###) & Mitigations
- R-001: — Mitigation:
- R-002:

## 6) Rollout / Verification Plan (high level)
- RV-001:
- RV-002:

## 7) Issues (optional)

---

## Challenge / Response / Approval (append-only)
```

### 6.3 `.ai/handoffs/Dev_to_Gov.md` — Template (Change & Verification Contract)

```md
Handoff: Dev_to_Gov
ID: FEATURE-000
Status: Draft
Owner: DEV
Mode: L1
Last updated: YYYY-MM-DD
Links:
  Upstream: .ai/handoffs/PM_to_Dev.md
  Downstream: .ai/archive/FEATURE-###/gov-review.md

---

## Gate
- If PM_to_Dev status != Approved: Challenge PM_to_Dev and STOP.

## 1) Summary (≤5 bullets)
- SUM-001:
- SUM-002:

## 2) Changeset
- Files touched:
  - <path>
- Interfaces changed (if any):
  - <name> — additive | breaking | behavior

## 3) Acceptance Mapping (complete)
- AT-001: PASS/FAIL — Evidence:
- AT-002: PASS/FAIL — Evidence:
- AT-003: PASS/FAIL — Evidence:

## 4) Verification Steps (reproducible)
- VS-001:
- VS-002:

## 5) Edge Cases & Failure Modes (FM-###)
- FM-001: — Handling:

## 6) Risks & Rollback Notes (high level)
- RR-001:

## 7) Deviations (must be explicit)
- DEV-SCOPE-001 (if any):
- DEV-GOV-001 (if any):

## 8) Issues (optional)

---

## Challenge / Response / Approval (append-only)
```

---

## 7) GOV Review + Archive (Manual Trigger)

### 7.1 GOV Review Requirements (PASS/FAIL)

GOV review MUST include:

1. Result: PASS / FAIL
2. Blocking issues (with pointers)
3. Optional improvements
4. Drift check against `.ai/charter.md` + BA Non-goals
5. Traceability check (SC ↔ AT ↔ Evidence)
6. Risk assessment (top 3)

Post-Task Delta (≤10 lines):

* Situation type:
* What surprised us:
* Next time rule (1):

### 7.2 Manual Archive Trigger

Archive runs only when explicitly requested (e.g., **"GOV: archive FEATURE-###"**).

Archive actions (GOV):

* Create `.ai/archive/FEATURE-###/`
* Copy current working handoffs into archive:

  * `.ai/handoffs/BA_to_PM.md` → `.ai/archive/FEATURE-###/BA_to_PM.md`
  * `.ai/handoffs/PM_to_Dev.md` → `.ai/archive/FEATURE-###/PM_to_Dev.md`
  * `.ai/handoffs/Dev_to_Gov.md` → `.ai/archive/FEATURE-###/Dev_to_Gov.md`
* Write GOV review to:

  * `.ai/archive/FEATURE-###/gov-review.md`
* (Optional) Write `snapshot.md` summarizing:

  * North Star, SC list, AT mapping, key calls, Post-Task Delta
* Reset working handoffs to fresh templates for next feature:

  * `.ai/handoffs/BA_to_PM.md` template
  * `.ai/handoffs/PM_to_Dev.md` template
  * `.ai/handoffs/Dev_to_Gov.md` template

---

## 8) Optional Generated Views (Derived, Manual Trigger)

`.ai/generated/*` are convenience views only. They can be deleted and regenerated anytime.
Not required for startup.

Paths:

* `.ai/generated/INDEX.md`          # navigation map (NOW / hotspots / entry points)
* `.ai/generated/standards.md`      # derived standards view (readable)
* `.ai/generated/decisions.yml`     # derived decisions registry (machine-readable)

Manual triggers:

* "GOV: regenerate index"
* "GOV: regenerate standards"
* "GOV: regenerate decisions"
* "GOV: regenerate all generated views"

Generation rules (relaxed):

* Keep outputs short and practical (INDEX ~1 page).
* Each item should reference a source: charter, working handoff, or archive snapshot/review.
* If ambiguous, leave TODO markers and request leader clarification (do not guess).

---

## 9) `.ai/charter.md` Template (Required)

If `.ai/charter.md` is missing, create it from this template:

```md
# Project Charter

## Purpose
- P-001: <why this exists in plain language, 2-3 lines max>
- P-002: <the pain it solves>
- P-003: <the moment it is used (daily capture + review)>

## North Star
- NS-001: <1 sentence describing the ideal experience, not features>

## Scope (MVP In-Scope)
- S-001: <must-have capability>
- S-002: <must-have capability>
- S-003: <must-have capability>
(Keep this list short. Anything outside requires a decision record.)

## Success definition (measurable)
- SD-001: <leading indicator metric>
- SD-002: <leading indicator metric>
- SD-003: <reliability metric>

## Non-goals (explicit OUT)
- NG-001: <things we will not build>
- NG-002:
- NG-003:
(Add more if needed, but keep it ruthless.)

## Primary trade-offs (we choose X over Y)
- T-001: <e.g., speed of capture over rich formatting>
- T-002: <e.g., reliability over advanced features>

## Constraints (hard rules)
- C-001: <e.g., single-user only>
- C-002: <e.g., keyboard-first; minimal formatting>
- C-003: <e.g., no timelines in BA outputs, etc. — if this belongs here>

## Drift alarms (if any occurs, STOP and record a decision)
- DA-001: <trigger phrase or request>
- DA-002:
- DA-003:

## Decision protocol
- DP-001: Any change to Scope / Non-goals / Trade-offs must be logged in `.ai/decisions.yml`
- DP-002: Each decision must include: rationale, impact, rollback plan

```
