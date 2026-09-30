import { useState } from 'react'
import './App.css'

import DesktopWindow from './DesktopWindow.jsx'
import Dock from './Dock.jsx'
import NotesApp from './NotesApp.jsx'
import TerminalApp from './TerminalApp.jsx'
import CoursesApp from './CoursesApp.jsx'

const APP_LABELS = {
  notes: 'Emacs',
  terminal: 'Terminal',
  courses: 'Courses',
}

const WINDOW_LABELS = {
  notes: 'notes.txt — Emacs',
  terminal: 'Terminal',
  courses: 'Courses',
}

export default function App() {
  const [desktop, setDesktop] = useState({
    windows: {
      notes: 'open',
      terminal: 'open',
      courses: 'closed',
    },
    order: ['notes', 'terminal'],
  })

  const { windows, order } = desktop

  const activeApp =
    [...order].reverse().find(id => windows[id] === 'open') ?? null

  function openApp(id) {
    setDesktop(previous => ({
      windows: {
        ...previous.windows,
        [id]: 'open',
      },
      order: [
        ...previous.order.filter(appId => appId !== id),
        id,
      ],
    }))
  }

  function focusApp(id) {
    setDesktop(previous => {
      if (previous.windows[id] !== 'open') return previous

      if (previous.order[previous.order.length - 1] === id) {
        return previous
      }

      return {
        ...previous,
        order: [
          ...previous.order.filter(appId => appId !== id),
          id,
        ],
      }
    })
  }

  function hideApp(id, status) {
    setDesktop(previous => ({
      windows: {
        ...previous.windows,
        [id]: status,
      },
      order: previous.order.filter(appId => appId !== id),
    }))
  }

  function openNotes() {
    openApp('notes')
  }

  function openTerminal() {
    openApp('terminal')
  }

  function getZIndex(id) {
    return 20 + Math.max(0, order.indexOf(id)) * 10
  }

  return (
    <main className="desktop">
      <header className="topbar">
        <div className="topbar__left">
          <span className="topbar__activities">
            Activities
          </span>

          <span className="topbar__app">
            {APP_LABELS[activeApp] ?? 'Desktop'}
          </span>

          <div className="window-tray">
            {Object.entries(windows)
              .filter(([, status]) => status === 'minimized')
              .map(([id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => openApp(id)}
                >
                  {WINDOW_LABELS[id]}
                </button>
              ))}
          </div>
        </div>

        <div className="topbar__clock">
          Jack’s Workstation
        </div>

        <div className="topbar__right">
          <span>◖))</span>
          <span>⏻</span>
        </div>
      </header>

      <Dock
        onOpenNotes={openNotes}
        onOpenTerminal={openTerminal}
        activeApp={activeApp}
        notesOpen={windows.notes !== 'closed'}
        terminalOpen={windows.terminal !== 'closed'}
      />

      <div className="desktop-shortcuts">
        <button
          type="button"
          className="desktop-shortcut"
          onClick={() => openApp('courses')}
          aria-label="Open Courses"
        >
          <span
            className="desktop-shortcut__icon"
            aria-hidden="true"
          >
            📁
          </span>

          <span className="desktop-shortcut__label">
            Courses
          </span>
        </button>
      </div>

      <DesktopWindow
        windowId="notes"
        title="notes.txt — Emacs"
        icon={<div className="emacs-logo">E</div>}
        className="emacs-window"
        hidden={windows.notes !== 'open'}
        onMinimize={() => hideApp('notes', 'minimized')}
        onClose={() => hideApp('notes', 'closed')}
        onFocus={() => focusApp('notes')}
        zIndex={getZIndex('notes')}
      >
        <NotesApp />
      </DesktopWindow>

      <DesktopWindow
        windowId="terminal"
        title="jack@workstation: ~"
        icon={
          <span className="terminal-mini-icon">&gt;_</span>
        }
        className="terminal-window"
        resizeMode="terminal"
        hidden={windows.terminal !== 'open'}
        onMinimize={() => hideApp('terminal', 'minimized')}
        onClose={() => hideApp('terminal', 'closed')}
        onFocus={() => focusApp('terminal')}
        zIndex={getZIndex('terminal')}
      >
        <TerminalApp
          onOpenNotes={openNotes}
          visible={windows.terminal === 'open'}
          active={activeApp === 'terminal'}
        />
      </DesktopWindow>

      <DesktopWindow
        windowId="courses"
        title="Courses — Files"
        icon={<span aria-hidden="true">📁</span>}
        className="courses-window"
        hidden={windows.courses !== 'open'}
        onMinimize={() => hideApp('courses', 'minimized')}
        onClose={() => hideApp('courses', 'closed')}
        onFocus={() => focusApp('courses')}
        zIndex={getZIndex('courses')}
      >
        <CoursesApp />
      </DesktopWindow>
    </main>
  )
}