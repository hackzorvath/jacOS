import { useState } from 'react'
import './NewtonFieldNotes.css'

const STORAGE_KEY = 'jacos-newton-var-tmp-v1'
const PAGE_COUNT = 4

function emptyNotebook() {
  return {
    pages: Array(PAGE_COUNT).fill(''),
    page: 0,
  }
}

function loadNotebook() {
  const empty = emptyNotebook()

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { notebook: empty, storageAvailable: true }

    const notebook = JSON.parse(saved)
    const valid =
      notebook &&
      Array.isArray(notebook.pages) &&
      notebook.pages.length === PAGE_COUNT &&
      notebook.pages.every(text => typeof text === 'string') &&
      Number.isInteger(notebook.page) &&
      notebook.page >= 0 &&
      notebook.page < PAGE_COUNT

    return {
      notebook: valid ? notebook : empty,
      storageAvailable: true,
    }
  } catch {
    return { notebook: empty, storageAvailable: false }
  }
}

export default function NewtonFieldNotes() {
  const [initial] = useState(loadNotebook)
  const [notebook, setNotebook] = useState(initial.notebook)
  const [saveStatus, setSaveStatus] = useState(
    initial.storageAvailable ? 'Saved locally' : 'Save unavailable',
  )

  // Save in the event handler rather than a delayed effect: leaving Notes
  // immediately after typing won't cancel a pending write.
  function commit(next) {
    setNotebook(next)

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      setSaveStatus('Saved locally')
    } catch {
      setSaveStatus('Save failed')
    }
  }

  function updateCurrentPage(text) {
    const pages = [...notebook.pages]
    pages[notebook.page] = text
    commit({ ...notebook, pages })
  }

  function goToPage(nextPage) {
    if (nextPage < 0 || nextPage >= PAGE_COUNT) return
    commit({ ...notebook, page: nextPage })
  }

  function clearCurrentPage() {
    if (!notebook.pages[notebook.page]) return

    if (window.confirm(`Clear page ${notebook.page + 1}? This can't be undone.`)) {
      updateCurrentPage('')
    }
  }

  function exportNotebook() {
    const contents = [
      '/var/tmp - Newton Field Notes',
      'Persistent, not permanent.',
      '',
      ...notebook.pages.flatMap((text, index) => [
        `--- Page ${index + 1} / ${PAGE_COUNT} ---`,
        text || '(empty)',
        '',
      ]),
    ].join('\n')

    const blob = new Blob([contents], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'var-tmp-notes.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  return (
    <section className="field-notes" aria-label="Newton field notebook">
      <header className="field-notes__toolbar">
        <div className="field-notes__identity">
          <h1>/var/tmp</h1>
          <span>Persistent, not permanent.</span>
        </div>

        <div className="field-notes__actions">
          <button type="button" onClick={exportNotebook}>Export</button>
          <button
            type="button"
            onClick={clearCurrentPage}
            disabled={!notebook.pages[notebook.page]}
          >
            Clear
          </button>
        </div>
      </header>

      <div className="field-notes__notebook">
        <div className="field-notes__coil" aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span key={index} />
          ))}
        </div>

        <div className="field-notes__paper">
          <textarea
            className="field-notes__textarea"
            aria-label={`Notebook page ${notebook.page + 1} of ${PAGE_COUNT}`}
            value={notebook.pages[notebook.page]}
            onChange={event => updateCurrentPage(event.target.value)}
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck
          />
        </div>

        <footer className="field-notes__pagebar">
          <span className="field-notes__status" role="status">
            {saveStatus}
          </span>

          <div className="field-notes__pager" aria-label="Notebook pages">
            <button
              type="button"
              onClick={() => goToPage(notebook.page - 1)}
              disabled={notebook.page === 0}
              aria-label="Previous page"
            >
              ‹
            </button>
            <span aria-live="polite">{notebook.page + 1} / {PAGE_COUNT}</span>
            <button
              type="button"
              onClick={() => goToPage(notebook.page + 1)}
              disabled={notebook.page === PAGE_COUNT - 1}
              aria-label="Next page"
            >
              ›
            </button>
          </div>

          <span className="field-notes__local">No sync</span>
        </footer>
      </div>
    </section>
  )
}
