import { useSystemError } from './SystemError.jsx'

export default function DesktopShortcut({
  id,
  label,
  icon,
  onOpen,
  restricted = false,
  selected = false,
  onSelect,
  position = {
    top: 58,
    right: 28,
  },
}) {
  const { showSystemError } = useSystemError()

  function attemptOpen() {
    if (restricted) {
      showSystemError()
      return
    }

    onOpen?.()
  }

  return (
    <button
      type="button"
      className={[
        'desktop-shortcut',
        selected ? 'is-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-desktop-id={id}
      style={position}
      aria-label={`${label}, desktop item. Double-click to open.`}
      title={`${label} — double-click to open`}
      onClick={() => {
        onSelect?.()
      }}
      onDoubleClick={event => {
        event.preventDefault()
        attemptOpen()
      }}
      onKeyDown={event => {
        if (
          event.key === 'Enter' &&
          !event.repeat
        ) {
          event.preventDefault()
          attemptOpen()
        }
      }}
    >
      <span
        className="desktop-shortcut__icon"
        aria-hidden="true"
      >
        {icon}
      </span>

      <span className="desktop-shortcut__label">
        {label}
      </span>
    </button>
  )
}