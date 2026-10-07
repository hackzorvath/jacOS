import './Dock.css'

const iconPath = filename => `${import.meta.env.BASE_URL}icons/${filename}`

const apps = [
  { id: 'saskpoly', label: 'Saskatchewan Polytechnic', file: 'saskpoly.ico' },
  { id: 'outlook', label: 'Outlook', file: 'outlook.svg' },
  { id: 'teams', label: 'Teams', file: 'teams.svg' },
  { id: 'brightspace', label: 'D2L — Brightspace', file: 'd2l.png' },
  { id: 'onedrive', label: 'OneDrive', file: 'onedrive.svg' },
  { id: 'sharepoint', label: 'SharePoint', file: 'sharepoint.svg' },
  { id: 'github', label: 'GitHub', file: 'github.svg' },
]

function AppIcon({ id, file }) {
  return (
    <span className={`dock-app-icon dock-app-icon--${id}`}>
      <img src={iconPath(file)} alt="" draggable={false} />
    </span>
  )
}

export default function Dock({
  onOpenNotes,
  onOpenTerminal,
  activeApp,
  notesOpen,
  terminalOpen,
}) {
  function appClass(id, isOpen) {
    return [
      'dock-item',
      isOpen ? 'dock-item--running' : '',
      isOpen && activeApp === id ? 'dock-item--focused' : '',
    ].filter(Boolean).join(' ')
  }

  return (
    <nav className="dock dock--logos" aria-label="Applications">
      <div className="dock__apps">
        {apps.map(app => (
          <button
            key={app.id}
            type="button"
            className="dock-item"
            aria-label={`${app.label} — coming soon`}
            disabled
          >
            <AppIcon id={app.id} file={app.file} />
            <span className="dock-tooltip">{app.label} — coming soon</span>
          </button>
        ))}

        <button
          type="button"
          className={appClass('terminal', terminalOpen)}
          aria-label={activeApp === 'terminal' ? 'Terminal — active' : 'Open terminal'}
          onClick={onOpenTerminal}
        >
          <span className="dock-app-icon dock-app-icon--terminal" aria-hidden="true">
            &gt;_
          </span>
          <span className="dock-tooltip">Terminal</span>
        </button>

        <button
          type="button"
          className={appClass('notes', notesOpen)}
          aria-label={activeApp === 'notes' ? 'Emacs — active' : 'Open notes'}
          onClick={onOpenNotes}
        >
          <AppIcon id="emacs" file="emacs.svg" />
          <span className="dock-tooltip">Emacs — Notes</span>
        </button>
      </div>

      <div className="dock__bottom">
        <div className="dock-separator" />
        <button
          type="button"
          className="dock-item"
          aria-label="Trash — coming soon"
          disabled
        >
          <AppIcon id="trash" file="trash.png" />
          <span className="dock-tooltip">Trash — coming soon</span>
        </button>
      </div>
    </nav>
  )
}
