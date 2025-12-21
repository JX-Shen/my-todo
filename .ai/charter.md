# Project Charter — Minimalist Web TODO (Workflowy-like)

## Purpose
- P-001: Create a single trusted place for my tasks so they stop scattering across apps and my head.
- P-002: Enable daily capture + daily/weekly review with near-zero friction.
- P-003: Keep focus on “what to do now” while still keeping 30-day and 90+ day context visible.

## North Star
- NS-001: Open the page and immediately capture/organize tasks with keyboard flow; the checklist feels reliable and calming.

## Scope (MVP In-Scope)
- S-001: Three always-visible lists: 90+ days / 30 days / Minimum todo.
- S-002: Nested list structure with keyboard-first editing (enter + indent/outdent).
- S-003: Minimum todo supports checkbox completion with strikethrough + gray, plus deletion.
- S-004: 30-day list exports markmap-compatible text (copy-to-clipboard).
- S-005: Data is durable locally (refresh/reopen does not lose tasks).

## Success definition (measurable)
- SD-001: Daily use happens with minimal friction (I can add an item in seconds).
- SD-002: “Minimum todo” closes loops daily (completed items exist and can be cleared/deleted).
- SD-003: Reliability: after refresh/reopen, structure + completion state remains intact (no data loss incidents).

## Non-goals (explicit OUT)
- NG-001: Collaboration, sharing links, accounts, permissions.
- NG-002: Complex tags, databases, filters, multi-view (kanban/calendar/etc.) — no Notion-like system.
- NG-003: Fancy analytics, dashboards, gamification, templates-as-a-system.
- NG-004: Rich content blocks (images/tables/embeds) beyond minimal formatting.

## Primary trade-offs (we choose X over Y)
- T-001: Capture speed & keyboard flow over rich formatting/features.
- T-002: Simplicity & consistency over “flexibility” and customization.
- T-003: Reliability (not losing tasks) over architectural ambition.

## Constraints (hard rules)
- C-001: Single-user personal use only.
- C-002: Formatting is minimal: only bold + italic (Markdown-ish).
- C-003: Avoid scope expansion unless explicitly approved and recorded.
- C-004: Prefer simplest solution that satisfies acceptance criteria.

## Drift alarms (if any occurs, STOP and record a decision)
- DA-001: Requests for tags, views, databases, backlinks, templates, or dashboards.
- DA-002: “Let’s support collaboration / login / cloud sync” before MVP is stable.
- DA-003: Proposals to introduce heavy editor frameworks primarily for extensibility rather than MVP necessity.

## Decision protocol
- DP-001: Any change to Scope / Non-goals / Trade-offs must be logged in `.ai/decisions.yml`.
- DP-002: Each decision includes: decision, rationale, impact, rollback plan.
