import { useEffect, useLayoutEffect, useMemo, useReducer, useRef, useState } from 'react'
import './App.css'

const HORIZONS = [
  { key: '90d', title: '90+ days', supportsCompletion: false },
  { key: '30d', title: '30 days', supportsCompletion: false },
  { key: 'min', title: 'Minimum todo', supportsCompletion: true },
]

const MAX_HISTORY = 200
const STORAGE_KEY = 'minimal-todo:v1'
const STORAGE_VERSION = 1

function makeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`
}

function createItem({ horizonKey, html = '', completed = false } = {}) {
  return {
    id: makeId(),
    html,
    children: [],
    ...(horizonKey === 'min' ? { completed } : null),
  }
}

function canonicalizeHtml(html) {
  if (!html) return ''

  const stripped = html.replace(/\u200B/g, '').trim()
  if (!stripped) return ''

  if (typeof document === 'undefined') {
    const compact = stripped.replace(/\s+/g, '').toLowerCase()
    if (
      compact === '<br>' ||
      compact === '<br/>' ||
      compact === '<div><br></div>' ||
      compact === '<p><br></p>'
    ) {
      return ''
    }
    return stripped
  }

  const container = document.createElement('div')
  container.innerHTML = stripped

  container.querySelectorAll('strong').forEach((strongEl) => {
    const b = document.createElement('b')
    b.innerHTML = strongEl.innerHTML
    strongEl.replaceWith(b)
  })

  container.querySelectorAll('em').forEach((emEl) => {
    const i = document.createElement('i')
    i.innerHTML = emEl.innerHTML
    emEl.replaceWith(i)
  })

  const text = (container.textContent ?? '').replace(/\u200B/g, '').trim()
  if (!text) return ''

  return container.innerHTML.replace(/\u200B/g, '')
}

function normalizeItem(value, { horizonKey } = {}) {
  if (!value || typeof value !== 'object') return createItem({ horizonKey })

  const id = typeof value.id === 'string' && value.id.length > 0 ? value.id : makeId()
  const html = canonicalizeHtml(typeof value.html === 'string' ? value.html : '')
  const children = Array.isArray(value.children) ? value.children : []

  const next = {
    id,
    html,
    children: children.map((child) => normalizeItem(child, { horizonKey })),
  }

  if (horizonKey === 'min') {
    next.completed = Boolean(value.completed)
  }

  return next
}

function normalizeDoc(rawDoc) {
  if (!rawDoc || typeof rawDoc !== 'object') return null

  const d90 = Array.isArray(rawDoc['90d']) ? rawDoc['90d'] : null
  const d30 = Array.isArray(rawDoc['30d']) ? rawDoc['30d'] : null
  const dMin = Array.isArray(rawDoc.min) ? rawDoc.min : null
  if (!d90 || !d30 || !dMin) return null

  return {
    '90d': d90.map((it) => normalizeItem(it, { horizonKey: '90d' })),
    '30d': d30.map((it) => normalizeItem(it, { horizonKey: '30d' })),
    min: dMin.map((it) => normalizeItem(it, { horizonKey: 'min' })),
  }
}

function loadPersistedDoc() {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.version !== STORAGE_VERSION) return null
    return normalizeDoc(parsed.doc)
  } catch {
    return null
  }
}

function savePersistedDoc(doc) {
  try {
    globalThis.localStorage?.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        savedAt: Date.now(),
        doc,
      }),
    )
  } catch {
    // ignore (quota, private mode, etc.)
  }
}

function cloneDoc(doc) {
  if (globalThis.structuredClone) return globalThis.structuredClone(doc)
  return JSON.parse(JSON.stringify(doc))
}

function historyReducer(state, action) {
  switch (action.type) {
    case 'COMMIT': {
      const nextPast = [...state.past, state.present].slice(-MAX_HISTORY)
      return {
        past: nextPast,
        present: { doc: action.doc, focusId: action.focusId },
        future: [],
      }
    }
    case 'UNDO': {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
      }
    }
    case 'REDO': {
      if (state.future.length === 0) return state
      const next = state.future[0]
      return {
        past: [...state.past, state.present].slice(-MAX_HISTORY),
        present: next,
        future: state.future.slice(1),
      }
    }
    default:
      return state
  }
}

function findAncestors(items, id, ancestors = []) {
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const nextAncestors = [...ancestors, { items, index, item }]
    if (item.id === id) return nextAncestors
    const foundInChildren = findAncestors(item.children, id, nextAncestors)
    if (foundInChildren) return foundInChildren
  }
  return null
}

function flattenIds(items, out = []) {
  for (const item of items) {
    out.push(item.id)
    if (item.children.length > 0) flattenIds(item.children, out)
  }
  return out
}

function getNodePath(root, node) {
  const path = []
  let current = node
  while (current && current !== root) {
    const parent = current.parentNode
    if (!parent) return null
    const index = Array.prototype.indexOf.call(parent.childNodes, current)
    if (index < 0) return null
    path.unshift(index)
    current = parent
  }
  return current === root ? path : null
}

function getNodeByPath(root, path) {
  let current = root
  for (const index of path) {
    const next = current.childNodes[index]
    if (!next) return null
    current = next
  }
  return current
}

function getSelectionSnapshot(rootEl) {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  const range = selection.getRangeAt(0)
  if (!rootEl.contains(range.startContainer)) return null

  const startPath = getNodePath(rootEl, range.startContainer)
  const endPath = getNodePath(rootEl, range.endContainer)
  if (!startPath || !endPath) return null

  return {
    startPath,
    startOffset: range.startOffset,
    endPath,
    endOffset: range.endOffset,
    isCollapsed: range.collapsed,
  }
}

function restoreSelectionSnapshot(rootEl, snapshot) {
  if (!snapshot) return
  const selection = window.getSelection()
  if (!selection) return

  const startNode = getNodeByPath(rootEl, snapshot.startPath)
  const endNode = getNodeByPath(rootEl, snapshot.endPath)
  if (!startNode || !endNode) return

  const range = document.createRange()
  range.setStart(startNode, snapshot.startOffset)
  range.setEnd(endNode, snapshot.endOffset)
  selection.removeAllRanges()
  selection.addRange(range)
}

function placeCaretAtEnd(el) {
  el.focus()
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  selection.removeAllRanges()
  selection.addRange(range)
}

function isUndo(e) {
  return (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z'
}

function isRedo(e) {
  const key = e.key.toLowerCase()
  return (
    (e.ctrlKey || e.metaKey) &&
    ((key === 'y' && !e.shiftKey) || (key === 'z' && e.shiftKey))
  )
}

function isBold(e) {
  return (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b'
}

function isItalic(e) {
  return (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i'
}

function initHistory() {
  const persisted = loadPersistedDoc()
  const doc =
    persisted ?? ({
      '90d': [createItem({ horizonKey: '90d' })],
      '30d': [createItem({ horizonKey: '30d' })],
      min: [createItem({ horizonKey: 'min' })],
    })
  const initialFocusId =
    doc.min[0]?.id ?? doc['30d'][0]?.id ?? doc['90d'][0]?.id ?? null

  return {
    past: [],
    present: { doc, focusId: initialFocusId },
    future: [],
  }
}

function updateItemInHorizon(items, id, updater) {
  let changed = false

  const nextItems = items.map((item) => {
    if (item.id === id) {
      changed = true
      return updater(item)
    }

    if (item.children.length === 0) return item

    const nextChildren = updateItemInHorizon(item.children, id, updater)
    if (nextChildren === item.children) return item

    changed = true
    return { ...item, children: nextChildren }
  })

  return changed ? nextItems : items
}

function App() {
  const [history, dispatch] = useReducer(historyReducer, null, initHistory)

  const doc = history.present.doc
  const focusId = history.present.focusId

  const editorRefs = useRef(new Map())
  const listHostRefs = useRef(new Map())
  const pendingSelectionRestoreRef = useRef(null)
  const lastSavedSerializedRef = useRef(null)

  const [exportOpen, setExportOpen] = useState(false)
  const [copyStatus, setCopyStatus] = useState('')

  const export30dText = useMemo(() => {
    return toMarkmapText(doc['30d'])
  }, [doc])

  function commit(nextDoc, nextFocusId) {
    dispatch({ type: 'COMMIT', doc: nextDoc, focusId: nextFocusId })
  }

  useEffect(() => {
    const serialized = JSON.stringify(doc)
    if (lastSavedSerializedRef.current === null) {
      lastSavedSerializedRef.current = serialized
      return
    }
    if (lastSavedSerializedRef.current === serialized) return
    lastSavedSerializedRef.current = serialized
    savePersistedDoc(doc)
  }, [doc])

  useEffect(() => {
    globalThis.__MVP_QA__ = {
      semanticSnapshotFromDom: () => {
        const horizons = {}
        for (const horizon of HORIZONS) {
          const host = document.querySelector(`.listHost[data-list="${horizon.key}"]`)
          horizons[horizon.key] = readTreeFromDom(host, {
            supportsCompletion: horizon.supportsCompletion,
          })
        }
        return { horizons }
      },
    }

    return () => {
      if (globalThis.__MVP_QA__) delete globalThis.__MVP_QA__
    }
  }, [])

  function updateHtml(horizonKey, id, html, selectionOffsets) {
    const nextHtml = canonicalizeHtml(html)
    const current = findAncestors(doc[horizonKey], id)
    if (!current) return
    const currentHtml = current[current.length - 1].item.html
    if (currentHtml === nextHtml) return

    const nextHorizon = updateItemInHorizon(doc[horizonKey], id, (item) => ({
      ...item,
      html: nextHtml,
    }))
    if (nextHorizon === doc[horizonKey]) return

    if (selectionOffsets) {
      pendingSelectionRestoreRef.current = { id, selection: selectionOffsets }
    }

    commit({ ...doc, [horizonKey]: nextHorizon }, id)
  }

  function toggleCompleted(id, completed, selectionOffsets) {
    const horizonKey = 'min'
    const current = findAncestors(doc[horizonKey], id)
    if (!current) return
    const currentCompleted = Boolean(current[current.length - 1].item.completed)
    if (currentCompleted === completed) return

    const nextHorizon = updateItemInHorizon(doc[horizonKey], id, (item) => ({
      ...item,
      completed,
    }))
    if (nextHorizon === doc[horizonKey]) return
    if (selectionOffsets) {
      pendingSelectionRestoreRef.current = { id, selection: selectionOffsets }
    }
    commit({ ...doc, [horizonKey]: nextHorizon }, id)
  }

  function insertAfter(horizonKey, idOrNull) {
    const nextDoc = cloneDoc(doc)
    const rootItems = nextDoc[horizonKey]

    const newItem = createItem({ horizonKey })

    if (!idOrNull) {
      rootItems.push(newItem)
      commit(nextDoc, newItem.id)
      return
    }

    const ancestors = findAncestors(rootItems, idOrNull)
    if (!ancestors) return

    const { items, index } = ancestors[ancestors.length - 1]
    items.splice(index + 1, 0, newItem)
    commit(nextDoc, newItem.id)
  }

  function deleteItem(horizonKey, id) {
    const nextDoc = cloneDoc(doc)
    const rootItems = nextDoc[horizonKey]
    const beforeIds = flattenIds(rootItems)
    const beforeIndex = beforeIds.indexOf(id)
    const ancestors = findAncestors(rootItems, id)
    if (!ancestors) return

    const { items, index } = ancestors[ancestors.length - 1]
    items.splice(index, 1)

    const afterIds = flattenIds(rootItems)
    const fallbackId =
      afterIds.length === 0
        ? null
        : afterIds[Math.min(Math.max(beforeIndex, 0), afterIds.length - 1)]
    commit(nextDoc, fallbackId)
  }

  function indent(horizonKey, id) {
    const nextDoc = cloneDoc(doc)
    const rootItems = nextDoc[horizonKey]
    const ancestors = findAncestors(rootItems, id)
    if (!ancestors) return

    const { items, index, item } = ancestors[ancestors.length - 1]
    if (index === 0) return

    const prevSibling = items[index - 1]
    items.splice(index, 1)
    prevSibling.children.push(item)
    commit(nextDoc, id)
  }

  function outdent(horizonKey, id) {
    const nextDoc = cloneDoc(doc)
    const rootItems = nextDoc[horizonKey]
    const ancestors = findAncestors(rootItems, id)
    if (!ancestors || ancestors.length < 2) return

    const parentEntry = ancestors[ancestors.length - 2]
    const currentEntry = ancestors[ancestors.length - 1]

    const grandparentItems = parentEntry.items

    currentEntry.items.splice(currentEntry.index, 1)
    grandparentItems.splice(parentEntry.index + 1, 0, currentEntry.item)

    commit(nextDoc, id)
  }

  function focusListHost(horizonKey) {
    const host = listHostRefs.current.get(horizonKey)
    if (host) host.focus()
  }

  function focusEditor(id, { toEnd = false } = {}) {
    const el = editorRefs.current.get(id)
    if (!el) return
    if (toEnd) {
      placeCaretAtEnd(el)
      return
    }
    el.focus()
  }

  useLayoutEffect(() => {
    if (!focusId) return
    const restore = pendingSelectionRestoreRef.current
    if (restore?.id === focusId) {
      pendingSelectionRestoreRef.current = null
      const el = editorRefs.current.get(focusId)
      if (el) {
        el.focus()
        restoreSelectionSnapshot(el, restore.selection)
      }
      return
    }

    focusEditor(focusId, { toEnd: true })
  }, [focusId, doc])

  function getVisibleIdsInHorizon(horizonKey) {
    return flattenIds(doc[horizonKey])
  }

  function moveFocusWithinHorizon(horizonKey, fromId, direction) {
    const ids = getVisibleIdsInHorizon(horizonKey)
    const idx = ids.indexOf(fromId)
    if (idx < 0) return
    const nextIdx = idx + direction
    if (nextIdx < 0 || nextIdx >= ids.length) return
    focusEditor(ids[nextIdx])
  }

  function onEditorKeyDown(e, horizonKey, id) {
    if (isUndo(e)) {
      e.preventDefault()
      dispatch({ type: 'UNDO' })
      return
    }

    if (isRedo(e)) {
      e.preventDefault()
      dispatch({ type: 'REDO' })
      return
    }

    if (horizonKey === 'min' && (e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      const ancestors = findAncestors(doc.min, id)
      if (!ancestors) return
      const current = Boolean(ancestors[ancestors.length - 1].item.completed)
      const el = editorRefs.current.get(id)
      toggleCompleted(id, !current, el ? getSelectionSnapshot(el) : null)
      return
    }

    if (isBold(e)) {
      e.preventDefault()
      document.execCommand('bold')
      const el = editorRefs.current.get(id)
      if (!el) return
      const selection = getSelectionSnapshot(el)
      if (selection && !selection.isCollapsed) {
        updateHtml(horizonKey, id, el.innerHTML, selection)
      }
      return
    }

    if (isItalic(e)) {
      e.preventDefault()
      document.execCommand('italic')
      const el = editorRefs.current.get(id)
      if (!el) return
      const selection = getSelectionSnapshot(el)
      if (selection && !selection.isCollapsed) {
        updateHtml(horizonKey, id, el.innerHTML, selection)
      }
      return
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      insertAfter(horizonKey, id)
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (e.shiftKey) outdent(horizonKey, id)
      else indent(horizonKey, id)
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      focusListHost(horizonKey)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      moveFocusWithinHorizon(horizonKey, id, -1)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      moveFocusWithinHorizon(horizonKey, id, 1)
      return
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      const el = editorRefs.current.get(id)
      const isEmpty = (el?.textContent ?? '').trim().length === 0
      if (isEmpty) {
        e.preventDefault()
        deleteItem(horizonKey, id)
      }
    }
  }

  function onEditorInput(horizonKey, id) {
    const el = editorRefs.current.get(id)
    if (!el) return
    updateHtml(horizonKey, id, el.innerHTML, getSelectionSnapshot(el))
  }

  function onListHostKeyDown(e, horizonKey) {
    if (e.key === 'Enter') {
      e.preventDefault()
      insertAfter(horizonKey, null)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const ids = getVisibleIdsInHorizon(horizonKey)
      if (ids.length > 0) focusEditor(ids[0])
      else insertAfter(horizonKey, null)
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const ids = getVisibleIdsInHorizon(horizonKey)
      if (ids.length > 0) focusEditor(ids[ids.length - 1])
    }

    if (isUndo(e)) {
      e.preventDefault()
      dispatch({ type: 'UNDO' })
    }

    if (isRedo(e)) {
      e.preventDefault()
      dispatch({ type: 'REDO' })
    }
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('Copied')
      window.setTimeout(() => setCopyStatus(''), 1200)
    } catch {
      setCopyStatus('Copy failed')
      window.setTimeout(() => setCopyStatus(''), 1200)
    }
  }

  return (
    <div className="appShell">
      <main className="threePane" aria-label="Task horizons">
        {HORIZONS.map((horizon) => (
          <section key={horizon.key} className="pane" data-horizon={horizon.key}>
            <header className="paneHeader">
              <h2 className="paneTitle">{horizon.title}</h2>
              {horizon.key === '30d' ? (
                <div className="paneTools">
                  <button
                    className="paneButton"
                    type="button"
                    onClick={() => setExportOpen((v) => !v)}
                  >
                    Export
                  </button>
                </div>
              ) : null}
            </header>
            <div className="paneBody">
              <div
                className="listHost"
                data-list={horizon.key}
                tabIndex={0}
                role="group"
                aria-label={`${horizon.title} list`}
                ref={(el) => {
                  if (el) listHostRefs.current.set(horizon.key, el)
                  else listHostRefs.current.delete(horizon.key)
                }}
                onKeyDown={(e) => onListHostKeyDown(e, horizon.key)}
              >
                <Tree
                  horizonKey={horizon.key}
                  items={doc[horizon.key]}
                  supportsCompletion={horizon.supportsCompletion}
                  editorRefs={editorRefs}
                  onEditorKeyDown={onEditorKeyDown}
                  onEditorInput={onEditorInput}
                  onToggleCompleted={toggleCompleted}
                />
              </div>
              {horizon.key === '30d' && exportOpen ? (
                <div className="exportPanel" role="group" aria-label="30-day export">
                  <div className="exportActions">
                    <button
                      className="paneButton"
                      type="button"
                      onClick={() => copyToClipboard(export30dText)}
                    >
                      Copy
                    </button>
                    <span className="exportStatus" aria-live="polite">
                      {copyStatus}
                    </span>
                  </div>
                  <textarea
                    className="exportText"
                    readOnly
                    value={export30dText}
                    rows={8}
                    aria-label="Markmap-compatible export text"
                  />
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}

function htmlToInlineMarkdown(html) {
  if (!html) return ''
  const container = document.createElement('div')
  container.innerHTML = html

  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue ?? ''
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ''
    const tag = node.tagName.toLowerCase()

    const content = Array.from(node.childNodes)
      .map((child) => walk(child))
      .join('')

    if (tag === 'b' || tag === 'strong') return `**${content}**`
    if (tag === 'i' || tag === 'em') return `*${content}*`
    if (tag === 'br') return '\n'
    return content
  }

  const text = Array.from(container.childNodes)
    .map((child) => walk(child))
    .join('')

  return text.replace(/\s+/g, ' ').trim()
}

function toMarkmapText(items) {
  const lines = []

  const visit = (nodes, depth) => {
    for (const node of nodes) {
      const label = htmlToInlineMarkdown(node.html)
      const hasChildren = node.children.length > 0
      if (label.length > 0 || hasChildren) {
        lines.push(`${'  '.repeat(depth)}- ${label}`)
      }
      if (hasChildren) visit(node.children, depth + 1)
    }
  }

  visit(items, 0)
  return lines.join('\n')
}

function normalizeSnapshotText(text) {
  return (text ?? '').replace(/\u200B/g, '').replace(/\s+/g, ' ').trim()
}

function readTreeFromDom(listHostEl, { supportsCompletion }) {
  if (!listHostEl) return []

  const findDirectChildTree = (li) => {
    for (const child of li.children) {
      if (child.tagName === 'UL' && child.classList.contains('tree')) return child
    }
    return null
  }

  const readItemsFromUl = (ul) => {
    if (!ul) return []
    const items = []
    for (const li of ul.children) {
      if (!(li instanceof HTMLElement) || li.tagName !== 'LI') continue

      const editor = li.querySelector('.treeEditor')
      const checkbox = supportsCompletion ? li.querySelector('input.treeCheckbox') : null

      const node = {
        text: normalizeSnapshotText(editor?.textContent ?? ''),
        html: canonicalizeHtml(editor?.innerHTML ?? ''),
        children: readItemsFromUl(findDirectChildTree(li)),
      }

      if (supportsCompletion) {
        node.completed = Boolean(checkbox?.checked)
      }

      items.push(node)
    }
    return items
  }

  const rootUl = listHostEl.querySelector('ul.tree')
  return readItemsFromUl(rootUl)
}

function Tree({
  horizonKey,
  items,
  supportsCompletion,
  editorRefs,
  onEditorKeyDown,
  onEditorInput,
  onToggleCompleted,
}) {
  return (
    <ul className="tree" role="list">
      {items.map((item) => (
        <TreeItem
          key={item.id}
          horizonKey={horizonKey}
          item={item}
          supportsCompletion={supportsCompletion}
          editorRefs={editorRefs}
          onEditorKeyDown={onEditorKeyDown}
          onEditorInput={onEditorInput}
          onToggleCompleted={onToggleCompleted}
        />
      ))}
    </ul>
  )
}

function TreeItem({
  horizonKey,
  item,
  supportsCompletion,
  editorRefs,
  onEditorKeyDown,
  onEditorInput,
  onToggleCompleted,
}) {
  const completed = supportsCompletion ? Boolean(item.completed) : false
  const placeholder = supportsCompletion ? 'Add a minimum todo…' : 'Add an item…'

  return (
    <li
      className="treeItem"
      role="listitem"
      data-id={item.id}
      {...(supportsCompletion ? { 'data-completed': completed ? 'true' : 'false' } : null)}
    >
      {supportsCompletion ? (
        <div className="treeRow treeRow--checkbox">
          <input
            className="treeCheckbox"
            type="checkbox"
            checked={completed}
            aria-label="Complete item"
            ref={(el) => {
              if (el) el.removeAttribute('checked')
            }}
            onChange={(e) => onToggleCompleted(item.id, e.target.checked)}
          />
          <span
            className="treeText treeEditor"
            role="textbox"
            aria-multiline="false"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            ref={(el) => {
              if (el) editorRefs.current.set(item.id, el)
              else editorRefs.current.delete(item.id)
            }}
            onKeyDown={(e) => onEditorKeyDown(e, horizonKey, item.id)}
            onInput={() => onEditorInput(horizonKey, item.id)}
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        </div>
      ) : (
        <div className="treeRow">
          <span className="treeBullet" aria-hidden="true" />
          <span
            className="treeText treeEditor"
            role="textbox"
            aria-multiline="false"
            tabIndex={0}
            contentEditable
            suppressContentEditableWarning
            data-placeholder={placeholder}
            ref={(el) => {
              if (el) editorRefs.current.set(item.id, el)
              else editorRefs.current.delete(item.id)
            }}
            onKeyDown={(e) => onEditorKeyDown(e, horizonKey, item.id)}
            onInput={() => onEditorInput(horizonKey, item.id)}
            dangerouslySetInnerHTML={{ __html: item.html }}
          />
        </div>
      )}

      {item.children.length > 0 ? (
        <Tree
          horizonKey={horizonKey}
          items={item.children}
          supportsCompletion={supportsCompletion}
          editorRefs={editorRefs}
          onEditorKeyDown={onEditorKeyDown}
          onEditorInput={onEditorInput}
          onToggleCompleted={onToggleCompleted}
        />
      ) : null}
    </li>
  )
}

export default App
