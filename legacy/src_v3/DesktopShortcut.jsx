import { useEffect, useRef, useState } from 'react'

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function loadPosition(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))

    if (
      saved &&
      Number.isFinite(saved.x) &&
      Number.isFinite(saved.y)
    ) {
      return { x: saved.x, y: saved.y }
    }
  } catch {
    // Use the CSS/default position when storage is unavailable.
  }

  return null
}

function savePosition(key, position) {
  try {
    localStorage.setItem(key, JSON.stringify(position))
  } catch {
    // Dragging still works if localStorage is unavailable.
  }
}

export default function DesktopShortcut({
  id,
  label,
  icon,
  onOpen,
  selected = false,
  onSelect,
  initialPosition = { top: 48, right: 12 },
}) {
  const storageKey = `jack-workstation-desktop-icon-${id}`
  const shortcutRef = useRef(null)
  const dragRef = useRef(null)
  const suppressClickRef = useRef(false)

  const [position, setPosition] = useState(
    () => loadPosition(storageKey),
  )
  const [dragging, setDragging] = useState(false)

  // Keep a stored icon position on-screen if the viewport becomes smaller.
  useEffect(() => {
    const element = shortcutRef.current
    if (!element || !position) return

    const desktop = element.offsetParent
    if (!desktop) return

    const observer = new ResizeObserver(() => {
      setPosition(previous => {
        if (!previous) return previous

        const maxX = Math.max(96, desktop.clientWidth - element.offsetWidth - 8)
        const maxY = Math.max(38, desktop.clientHeight - element.offsetHeight - 8)

        const next = {
          x: clamp(previous.x, Math.min(96, maxX), maxX),
          y: clamp(previous.y, 38, maxY),
        }

        if (next.x === previous.x && next.y === previous.y) {
          return previous
        }

        savePosition(storageKey, next)
        return next
      })
    })

    observer.observe(desktop)
    return () => observer.disconnect()
  }, [position, storageKey])

  function handlePointerDown(event) {
    if (!event.isPrimary || event.button !== 0) return

    const element = shortcutRef.current
    const desktop = element?.offsetParent

    if (!element || !desktop) return

    const rect = element.getBoundingClientRect()
    const desktopRect = desktop.getBoundingClientRect()

    dragRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      startX: rect.left - desktopRect.left,
      startY: rect.top - desktopRect.top,
      desktopWidth: desktop.clientWidth,
      desktopHeight: desktop.clientHeight,
      width: rect.width,
      height: rect.height,
      moved: false,
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    onSelect?.()
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const dx = event.clientX - drag.startPointerX
    const dy = event.clientY - drag.startPointerY

    if (!drag.moved && Math.hypot(dx, dy) < 4) return

    drag.moved = true
    setDragging(true)

    const maxX = Math.max(96, drag.desktopWidth - drag.width - 8)
    const maxY = Math.max(38, drag.desktopHeight - drag.height - 8)

    setPosition({
      x: clamp(drag.startX + dx, Math.min(96, maxX), maxX),
      y: clamp(drag.startY + dy, 38, maxY),
    })
  }

  function finishPointer(event) {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }

    if (drag.moved) {
      suppressClickRef.current = true

      // Pointer interactions normally dispatch a click immediately after
      // pointerup. Clear this on the next task as a safety net so a browser
      // that suppresses that click does not swallow the user's next click.
      window.setTimeout(() => {
        suppressClickRef.current = false
      }, 0)

      setPosition(previous => {
        if (previous) savePosition(storageKey, previous)
        return previous
      })
    }

    dragRef.current = null
    setDragging(false)
  }

  const style = position
    ? {
        left: `${position.x}px`,
        top: `${position.y}px`,
      }
    : initialPosition

  return (
    <button
      ref={shortcutRef}
      type="button"
      className={[
        'desktop-shortcut',
        selected ? 'is-selected' : '',
        dragging ? 'is-dragging' : '',
      ].filter(Boolean).join(' ')}
      style={style}
      aria-label={`${label}, desktop item. Double-click to open.`}
      title={`${label} — double-click to open`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishPointer}
      onPointerCancel={finishPointer}
      onClick={event => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false
          event.preventDefault()
          return
        }

        onSelect?.()
      }}
      onDoubleClick={event => {
        if (suppressClickRef.current) {
          suppressClickRef.current = false
          event.preventDefault()
          return
        }

        onOpen?.()
      }}
      onKeyDown={event => {
        if (event.key === 'Enter' && !event.repeat) {
          event.preventDefault()
          onOpen?.()
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
