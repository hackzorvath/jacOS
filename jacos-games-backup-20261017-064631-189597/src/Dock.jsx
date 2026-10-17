import './Dock.css'
import { EXTERNAL_LINKS } from './system/externalLinks.js'

const iconPath = filename => `${import.meta.env.BASE_URL}icons/${filename}`

const apps = [
    {
    id: 'sift',
    label: 'Sift: GB Jam 14',
    file: 'gbjam14.png',
    href: EXTERNAL_LINKS.sift,
  },
  {
    id: 'saskpoly',
    label: 'Saskatchewan Polytechnic',
    file: 'saskpoly.ico',
    href: EXTERNAL_LINKS.saskpoly,
  },
  {
    id: 'outlook',
    label: 'Outlook',
    file: 'outlook.svg',
    href: EXTERNAL_LINKS.outlook,
  },
  {
    id: 'teams',
    label: 'Teams',
    file: 'teams.svg',
    href: EXTERNAL_LINKS.teams,
  },
  {
    id: 'brightspace',
    label: 'Brightspace',
    file: 'd2l.png',
    href: EXTERNAL_LINKS.brightspace,
  },
  {
    id: 'onedrive',
    label: 'OneDrive',
    file: 'onedrive.svg',
    href: EXTERNAL_LINKS.onedrive,
  },
  {
    id: 'sharepoint',
    label: 'SharePoint',
    file: 'sharepoint.svg',
    href: EXTERNAL_LINKS.sharepoint,
  },
  {
    id: 'pandoc',
    label: 'Pandoc',
    file: 'pandoc-jacos.svg',
    href: EXTERNAL_LINKS.pandoc,
  },
  {
    id: 'github',
    label: 'GitHub',
    file: 'github.svg',
    href: EXTERNAL_LINKS.github,
  },
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
  onOpenTrash,
  activeApp,
  notesOpen,
  terminalOpen,
  trashOpen,
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
        {apps.map(app => {
          if (!app.href) {
            return (
              <button
                key={app.id}
                type="button"
                className="dock-item"
                aria-label={`${app.label} — coming soon`}
                disabled
              >
                <AppIcon id={app.id} file={app.file} />

                <span className="dock-tooltip">
                  {app.label} — coming soon
                </span>
              </button>
            )
          }

          return (
            <a
              key={app.id}
              className="dock-item"
              href={app.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${app.label}`}
            >
              <AppIcon id={app.id} file={app.file} />

              <span className="dock-tooltip">
                {app.label}
              </span>
            </a>
          )
        })}

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
          aria-label={activeApp === 'notes' ? 'Emacs: active' : 'Open notes'}
          onClick={onOpenNotes}
        >
          <AppIcon id="emacs" file="emacs.svg" />
          <span className="dock-tooltip">Emacs: Notes</span>
        </button>
      </div>

      <div className="dock__bottom">
        <div className="dock-separator" />
        <button
          type="button"
          className={appClass('trash', trashOpen)}
          aria-label={activeApp === 'trash' ? 'Trash — active' : 'Open Trash'}
          onClick={onOpenTrash}
        >
          <AppIcon id="trash" file="trash.png" />
          <span className="dock-tooltip">Trash</span>
        </button>
      </div>
    </nav>
  )
}
