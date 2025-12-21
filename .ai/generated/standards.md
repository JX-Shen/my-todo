# Derived Standards View

**Generated**: 2025-12-22  
**Source**: `.ai/archive/FEATURE-001/QA-standards-semantic-testing.md`  
**Scope**: All features  
**Review Cycle**: Annually or after major framework/tooling changes

---

## 1. Durability / Persistence Assertions

### Standard: Test Semantic State, Not DOM Serialization

**Applies to**: Any feature with state that must survive Reload, Reopen, or data persistence (localStorage, IndexedDB, API).

#### Anti-pattern ❌
```javascript
const domBefore = element.innerHTML;
// ... perform Reload ...
const domAfter = element.innerHTML;
expect(domBefore).toBe(domAfter); // FALSE FAILURES
```

#### Pattern ✓
```javascript
const snapshotBefore = window.__MVP_QA__.semanticSnapshotFromDom();
// ... perform Reload ...
const snapshotAfter = window.__MVP_QA__.semanticSnapshotFromDom();
expect(JSON.stringify(snapshotBefore)).toBe(JSON.stringify(snapshotAfter));
```

#### Why
Browsers/frameworks change DOM serialization (boolean attributes, whitespace, tag aliases) without changing semantic state. Comparing strings is inherently flaky.

#### Implementation Checklist
- [ ] Design semantic snapshot function (walk data model, ignore serialization)
- [ ] Expose for QA (internal: `window.__FEATURE_QA__.semanticSnapshot()`)
- [ ] Document: what counts as semantic vs serialization artifact
- [ ] QA harness: compare JSON stringifications, not DOM strings
- [ ] Test: 3+ consecutive runs (Reload + Reopen) with zero flakiness

---

## 2. Keyboard Interaction Testing

### Standard: Verify Behavior, Not Event Details

**Applies to**: Feature with keyboard-first interaction (editor, shortcuts, navigation).

#### Anti-pattern ❌
```javascript
// Testing internal event handling, not user behavior
expect(onKeyDownHandler).toHaveBeenCalledWith(
  expect.objectContaining({ key: 'Tab', preventDefault: jasmine.any(Function) })
);
```

#### Pattern ✓
```javascript
// Testing observable behavior: action → result
user.press('Tab');
expect(item).toHaveIndentedUnderPrevious();
expect(dom).toHaveNestedULStructure();
```

#### Why
Framework internals change (React fiber, versions, Svelte, etc.). Cross-browser event differences exist. Testing behavior is future-proof.

#### Checklist
- [ ] Test **action and result**, not event object internals
- [ ] Verify **observable DOM changes** (structure, content, styling)
- [ ] Avoid checking **event handler details** or **framework-specific state**

---

## 3. Formatting / Rich Content Assertions

### Standard: Compare Canonical Representation, Not Raw HTML

**Applies to**: Feature with text formatting (bold, italic, links).

#### Anti-pattern ❌
```javascript
expect(element.innerHTML).toContain('<strong>');
// OR
expect(element.innerHTML).toContain('<b>');
// Both fail on different browsers/frameworks
```

#### Pattern ✓
```javascript
const normalized = normalizeHTML(element.innerHTML); // <strong> → <b>
expect(normalized).toContain('<b>bold text</b>');
```

#### Why
HTML allows multiple representations (`<b>` vs `<strong>`, `<em>` vs `<i>`). Browsers/frameworks normalize differently. Content is the same; serialization differs.

#### Checklist
- [ ] Normalize tags to canonical form (<b>, <i>, <a>, etc.)
- [ ] Compare normalized HTML, not raw serialization
- [ ] Accept multiple HTML representations of same content

---

## 4. Completion / State Toggle Testing

### Standard: Read Property State, Not HTML Attribute

**Applies to**: Feature with toggles (completed, checked, selected, enabled/disabled).

#### Anti-pattern ❌
```javascript
expect(element.getAttribute('checked')).toBe('checked');
// OR
expect(element.innerHTML).toContain('checked=""');
// Both measure serialization, not state
```

#### Pattern ✓
```javascript
const checkbox = element.querySelector('input[type="checkbox"]');
expect(checkbox.checked).toBe(true); // Read property directly
```

#### Why
HTML attributes and DOM properties can diverge during serialization. Property state is the ground truth. Attribute presence/absence is browser/framework-specific.

#### Checklist
- [ ] Read DOM properties directly (`.checked`, `.disabled`, etc.)
- [ ] Avoid testing attribute presence/absence
- [ ] Test toggle behavior (before → after state)

---

## 5. Undo/Redo Testing

### Standard: Test Full State Restoration, Not History Internals

**Applies to**: Feature with undo/redo stack.

#### Anti-pattern ❌
```javascript
expect(history.past.length).toBe(1); // Testing implementation
expect(history[history.length - 1].id).toMatch(/^action-/); // Testing internal structure
```

#### Pattern ✓
```javascript
const state1 = semanticSnapshot();
performAction();
const state2 = semanticSnapshot();
undo();
const state1Restored = semanticSnapshot();
expect(JSON.stringify(state1)).toBe(JSON.stringify(state1Restored));
```

#### Why
History structure is implementation detail. Users care about state restoration, not stack depth or node IDs. Refactoring history (e.g., compression, persistence) should not break tests.

#### Checklist
- [ ] Test **semantic state before/after undo**
- [ ] Avoid checking **history internals** (stack depth, node IDs, timestamps)
- [ ] Verify **full state restoration** (all data, hierarchy, properties)

---

## 6. Export / Integration Testing

### Standard: Compare Output Semantically, Not Textually

**Applies to**: Feature with data export (JSON, CSV, Markdown).

#### Anti-pattern: Markdown ❌
```javascript
expect(exported).toBe(
  "- Buy milk\n  - at store\n"
); // Fails on whitespace, formatting changes
```

#### Pattern: Markdown ✓
```javascript
const parsed = parseMarkdown(exported);
expect(parsed.items[0].text).toBe("Buy milk");
expect(parsed.items[0].children[0].text).toBe("at store");
```

#### Anti-pattern: JSON ❌
```javascript
expect(exported).toBe(JSON.stringify(expectedData));
// Fails on key order, formatting, whitespace
```

#### Pattern: JSON ✓
```javascript
const data = JSON.parse(exported);
expect(data).toEqual(expectedStructure);
// Ignores formatting, key order
```

#### Why
Whitespace, formatting, and order are serialization details. Content and structure matter. Allows flexibility in export format evolution.

#### Checklist
- [ ] **Parse exported data** to semantic structure
- [ ] Test **semantic equivalence**, not textual equality
- [ ] Allow **format flexibility** (whitespace, order, aliases)

---

## Anti-patterns (Do NOT)

| Anti-pattern | Why | Use Instead |
|---|---|---|
| `innerHTML` string equality for durability | Serialization varies | Semantic snapshot |
| Attribute presence/absence for state | May differ from property | Read properties directly |
| Event object inspection | Framework internals change | Verify behavior (action → result) |
| History internals (stack depth, ids) | Implementation detail | Verify state restoration |
| DOM structure assumptions | Framework may refactor | Test meaningful content |
| Whitespace/formatting equality for export | Normalization varies | Compare parsed structure |
| Testing framework code (React internals) | Brittle to upgrades | Test observable behavior |

---

## Checklist: Feature with Durability/Persistence

Apply this checklist when reviewing a feature that persists state:

- [ ] **Semantic snapshot designed**: Function captures meaningful state (text, hierarchy, properties)
- [ ] **Serialization artifacts ignored**: Whitespace, boolean attributes, tag aliases explicitly excluded
- [ ] **Handoff documents it**: PM_to_Dev / Dev_to_Gov explain semantic vs artifact
- [ ] **QA harness uses it**: Snapshots compared as JSON, not DOM strings
- [ ] **Tested 3+ runs**: Reload + Reopen tested multiple times, zero flakiness
- [ ] **GOV approves pattern**: Review includes semantic testing acknowledgment

---

## References

**Full Standard Document**: `.ai/archive/FEATURE-001/QA-standards-semantic-testing.md`

**Governance Decision**: `.ai/archive/FEATURE-001/GOV-decision-durability-testing.md`

**Example Implementation**: `my-todo/src/App.jsx` — `window.__MVP_QA__.semanticSnapshotFromDom()`

**Feature Archive**: `.ai/archive/FEATURE-001/` (6 documents including QA-006 post-mortem)

---

**Approved by**: GOV  
**Effective**: FEATURE-002 and onwards  
**Regenerate**: `GOV: regenerate standards`
