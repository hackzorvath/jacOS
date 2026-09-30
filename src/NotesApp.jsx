import './NotesApp.css'
import { useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'jack-workstation-notes'

function loadNotes() {
  try {
    return {
      text: localStorage.getItem(STORAGE_KEY) ?? '',
      error: false,
    }
  } catch {
    return {
      text: '',
      error: true,
    }
  }
}

export default function NotesApp() {
  const [initialNotes] = useState(loadNotes)
  const [text, setText] = useState(initialNotes.text)
  const [cursor, setCursor] = useState(0)

  const [saveStatus, setSaveStatus] = useState(
    initialNotes.error ? 'Storage unavailable' : 'Saved locally',
  )

  const lineNumbersRef = useRef(null)

  const lines = text.split('\n')
  const beforeCursor = text.slice(0, cursor).split('\n')
  const currentLine = beforeCursor.length
  const currentColumn = beforeCursor.at(-1).length + 1

  useEffect(() => {
    // Avoid overwriting stored notes if the initial read failed.
    if (initialNotes.error) return

    // Save after a short pause in typing.
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, text)
        setSaveStatus('Saved locally')
      } catch {
        setSaveStatus('Save failed — use Download')
      }
    }, 300)

    // Cancel the previous timer when text changes again.
    return () => clearTimeout(timeout)
  }, [text, initialNotes.error])

  function handleChange(event) {
    setText(event.target.value)
    setCursor(event.target.selectionStart)

    setSaveStatus(
      initialNotes.error
        ? 'Storage unavailable — use Download'
        : 'Saving…',
    )
  }

  function handleSelect(event) {
    setCursor(event.target.selectionStart)
  }

  function handleScroll(event) {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.style.transform =
        `translateY(-${event.target.scrollTop}px)`
    }
  }

  function downloadNotes() {
    const file = new Blob([text], {
      type: 'text/plain;charset=utf-8',
    })

    const url = URL.createObjectURL(file)
    const link = document.createElement('a')

    link.href = url
    link.download = 'notes.txt'

    document.body.appendChild(link)
    link.click()
    link.remove()

    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="notes-app">
      <nav className="emacs-menubar" aria-label="Editor menu">
        <span>File</span>
        <span>Edit</span>
        <span>Options</span>
        <span>Buffers</span>
        <span>Tools</span>
        <span>Help</span>

        <button
          type="button"
          className="emacs-download"
          onClick={downloadNotes}
        >
          Download
        </button>
      </nav>

      <div className="editor">
        <div className="editor-lines" aria-hidden="true">
          <div ref={lineNumbersRef}>
            {lines.map((line, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>
        </div>

        <textarea
          className="editor-text"
          aria-label="Notes editor"
          spellCheck={false}
          wrap="off"
          value={text}
          onChange={handleChange}
          onSelect={handleSelect}
          onScroll={handleScroll}
        />
      </div>

      <footer className="emacs-footer">
        <strong>notes.txt</strong>

        <span
          className={
            saveStatus === 'Saved locally'
              ? 'save-status save-status--saved'
              : 'save-status save-status--modified'
          }
          title={saveStatus}
        >
          {saveStatus}
        </span>

        <span className="footer-spacer" />

        <span>
          L{currentLine}, C{currentColumn}
        </span>
      </footer>
    </div>
  )
}