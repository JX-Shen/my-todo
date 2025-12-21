# QA Testing Standards (GOV Guidance)

**Version**: 1.0  
**Last Updated**: 2025-12-21  
**Scope**: All features  

---

## 1. Durability / Persistence Assertions

### Rule: Test Semantic State, Not DOM Serialization

**When**: Your feature includes state that must survive Reload, Reopen, or data layer operations (localStorage, IndexedDB, API persistence).

**What NOT to do** ❌
```javascript
// FLAKY: DOM serialization changes without semantic change
const domBefore = element.innerHTML;
// ... perform Reload ...
const domAfter = element.innerHTML;
expect(domBefore).toBe(domAfter); // ← FALSE FAILURES
```

**What TO do** ✓
```javascript
// STABLE: Semantic snapshot comparison
const snapshotBefore = window.__MVP_QA__.semanticSnapshotFromDom();
// ... perform Reload ...
const snapshotAfter = window.__MVP_QA__.semanticSnapshotFromDom();
expect(JSON.stringify(snapshotBefore)).toBe(JSON.stringify(snapshotAfter)); // ← Reliable
```

### Steps for Feature Implementation

1. **Design semantic snapshot function**
   - Walk your data structure (not DOM)
   - Extract meaningful state: text, hierarchy, properties, enums
   - Ignore serialization details: whitespace, tag aliases, boolean attributes
   
2. **Expose for QA** (internal, non-shipping)
   - `window.__FEATURE_QA__.semanticSnapshot()` pattern
   - Or similar scope to avoid collisions

3. **QA harness**
   - Capture snapshot before operation
   - Perform Reload / Reopen / API call
   - Capture snapshot after
   - Compare JSON serializations

4. **Document**
   - List what counts as semantic (e.g., item text, hierarchy)
   - List what is ignored (e.g., dom attribute order, whitespace)

---

## 2. Keyboard Interaction Testing

### Rule: Verify Behavior, Not Event Details

**When**: Feature includes keyboard-first interaction (editor, shortcuts, navigation).

### Approach
- Test **action and result**, not internal event handling
- Example: `Press Tab → item indents; hierarchy updates; styling reflects nesting`
- Not: `Tab event preventDefault fires; onKeyDown handler called with specific event object`

### Why
- Framework internals change (React fiber, React 19, Svelte, etc.)
- Cross-browser event differences exist
- Testing behavior is future-proof

---

## 3. Formatting / Rich Content Assertions

### Rule: Compare Canonical Representation, Not Raw HTML

**When**: Feature includes text formatting (bold, italic, links, etc.).

### Approach
```javascript
// NOT: expect(element.innerHTML).toContain('<strong>');
// NOT: expect(element.innerHTML).toContain('<b>');

// YES: Normalize to canonical form and compare
const normalized = normalizeHTML(element.innerHTML); // <strong> → <b>, etc.
expect(normalized).toContain('<b>bold text</b>');
```

### Why
- HTML allows multiple representations (`<b>` vs `<strong>`, etc.)
- Browsers/frameworks normalize differently
- Content is the same; serialization differs

---

## 4. Completion / State Toggle Testing

### Rule: Read Property State, Not HTML Attribute

**When**: Feature includes toggles (completed, checked, selected, etc.).

### Approach
```javascript
// NOT: expect(element.getAttribute('checked')).toBe('checked');
// NOT: expect(element.innerHTML).toContain('checked=""');

// YES: Read property directly
const checkbox = element.querySelector('input[type="checkbox"]');
expect(checkbox.checked).toBe(true); // Property, not attribute
```

### Why
- HTML attributes and DOM properties can diverge during serialization
- Property state is the ground truth
- Attribute serialization is browser/framework-specific

---

## 5. Undo/Redo Testing

### Rule: Test Full State Restoration, Not History Internals

**When**: Feature includes undo/redo stack.

### Approach
```javascript
// NOT: expect(history.past.length).toBe(1);

// YES: Verify full semantic state restoration
const state1 = semanticSnapshot();
performAction();
const state2 = semanticSnapshot();
undo();
const state1Restored = semanticSnapshot();
expect(JSON.stringify(state1)).toBe(JSON.stringify(state1Restored));
```

### Why
- History structure is implementation detail
- Users care about state restoration, not stack depth
- Refactoring history (e.g., compression, persistence) should not break tests

---

## 6. Export / Integration Testing

### Rule: Compare Output Semantically, Not Textually

**When**: Feature exports data (JSON, CSV, Markdown, etc.).

### Approach for Markdown/Text
```javascript
// NOT: expect(exported).toBe("exact string");

// YES: Parse and compare structure
const parsed = parseMarkdown(exported);
expect(parsed.items[0].text).toBe("Buy milk");
expect(parsed.items[0].children[0].text).toBe("at store");
```

### Approach for JSON
```javascript
// YES: Parse and compare semantically
const data = JSON.parse(exported);
expect(data).toEqual({ horizons: { '30d': [...] } });
// (ignore formatting, key order)
```

### Why
- Whitespace, formatting, and order are serialization details
- Content and structure matter
- Allows flexibility in export format evolution

---

## Anti-patterns (Do NOT)

| Anti-pattern | Why | Use Instead |
|---|---|---|
| `innerHTML` string equality | Serialization varies by browser/framework | Semantic snapshot |
| Attribute presence/absence | May differ from property state | Read properties directly |
| Exact event object inspection | Framework internals change | Verify behavior (action → result) |
| History internals (stack depth, node ids) | Implementation detail | Verify state restoration |
| DOM structure assumptions | Framework may refactor | Test meaningful content |
| Whitespace/formatting equality | Normalization varies | Compare parsed structure |

---

## Checklist for Feature Durability/Persistence

- [ ] Semantic snapshot function designed and exposed for QA
- [ ] PM_to_Dev / Dev_to_Gov lists what counts as "semantic" vs "serialization artifact"
- [ ] QA harness compares semantic snapshots, not DOM strings
- [ ] Tested across 3+ runs (Reload + Reopen or equivalent)
- [ ] No flakiness observed in CI/local runs
- [ ] GOV review confirms semantic testing approach before approval

---

## References

- FEATURE-001 decision: `.ai/archive/FEATURE-001/GOV-decision-durability-testing.md`
- QA-006 post-mortem: `.ai/archive/FEATURE-001/gov-review.md` (Post-Task Delta)

---

**Approved by GOV**  
**Effective**: FEATURE-002 and onwards  
**Review Cycle**: Annually or after major framework/tooling changes
