import './DesktopWindow.css'
import { useEffect, useRef, useState } from 'react'

const DIRECTIONS = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max))
}

function loadLayout(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key))

    if (
      saved &&
      Number.isFinite(saved.x) &&
      Number.isFinite(saved.y)
    ) {
      return {
        x: saved.x,
        y: saved.y,
        width:
          Number.isFinite(saved.width) && saved.width > 0
            ? saved.width
            : undefined,
        height:
          Number.isFinite(saved.height) && saved.height > 0
            ? saved.height
            : undefined,
      }
    }
  } catch {
    // Use the default CSS layout.
  }

  return null
}

function saveLayout(key, layout) {
  try {
    localStorage.setItem(key, JSON.stringify(layout))
  } catch {
    // The window still works without storage.
  }
}

function measureSteps(element, resizeMode) {
  if (resizeMode !== 'terminal') {
    return { x: 1, y: 1 }
  }

  const terminal = element.querySelector('.terminal-app')

  if (!terminal) {
    return { x: 8, y: 20 }
  }

  const style = getComputedStyle(terminal)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  let characterWidth = 8

  if (context) {
    context.font = [
      style.fontStyle,
      style.fontWeight,
      style.fontSize,
      style.fontFamily,
    ].join(' ')

    characterWidth = context.measureText('M').width || 8
  }

  return {
    x: characterWidth,
    y: parseFloat(style.lineHeight) || 20,
  }
}

function snapSize(value, start, step, min, max) {
  const minimum = Math.min(min, max)

  const firstStep = Math.ceil((minimum - start) / step)
  const lastStep = Math.floor((max - start) / step)

  // Very small viewports may not have room for a full step.
  if (firstStep > lastStep) {
    return clamp(value, minimum, max)
  }

  const steps = Math.round((value - start) / step)

  return start + clamp(steps, firstStep, lastStep) * step
}

export default function DesktopWindow({
  windowId,
  title,
  icon,
  className = '',
  children,
  hidden,
  onMinimize,
  onClose,
  onFocus,
  zIndex,
  resizeMode = 'smooth',
}) {
  const storageKey = `jack-workstation-window-${windowId}`

  const [maximized, setMaximized] = useState(false)
  const [layout, setLayout] = useState(
    () => loadLayout(storageKey),
  )
  const [interaction, setInteraction] = useState(null)

  const windowRef = useRef(null)
  const interactionRef = useRef(null)

  // Keep restored windows within the current desktop.
  useEffect(() => {
    const element = windowRef.current

    if (!element || hidden || maximized) return

    const desktop = element.offsetParent
    if (!desktop) return

    const observer = new ResizeObserver(() => {
      if (interactionRef.current) return

      setLayout(previous => {
        if (!previous) return previous

        const desktopWidth = desktop.clientWidth
        const desktopHeight = desktop.clientHeight
        const leftMargin = desktopWidth >= 400 ? 100 : 8

        const maxWidth = Math.max(
          1,
          desktopWidth - leftMargin - 8,
        )

        const maxHeight = Math.max(1, desktopHeight - 46)

        const width = previous.width === undefined
          ? undefined
          : Math.min(previous.width, maxWidth)

        const height = previous.height === undefined
          ? undefined
          : Math.min(previous.height, maxHeight)

        const actualWidth = width ?? element.offsetWidth

        const maxX = Math.max(
          0,
          desktopWidth - actualWidth - 8,
        )

        const next = {
          x: clamp(
            previous.x,
            Math.min(leftMargin, maxX),
            maxX,
          ),
          y: clamp(
            previous.y,
            38,
            Math.max(38, desktopHeight - 51),
          ),
          width,
          height,
        }

        const unchanged = Object.keys(next).every(
          key => next[key] === previous[key],
        )

        return unchanged ? previous : next
      })
    })

    observer.observe(desktop)

    return () => observer.disconnect()
  }, [hidden, maximized])

  function startInteraction(event, direction = null) {
    if (!event.isPrimary || event.button !== 0) return
    if (maximized) return

    if (!direction && event.target.closest('button')) return

    const element = windowRef.current
    const desktop = element.offsetParent

    if (!desktop) return

    const rect = element.getBoundingClientRect()

    const start = {
      x: element.offsetLeft,
      y: element.offsetTop,
      width: rect.width,
      height: rect.height,
    }

    interactionRef.current = {
      pointerId: event.pointerId,
      captureElement: event.currentTarget,
      pointerX: event.clientX,
      pointerY: event.clientY,
      direction,
      start,
      latest: start,
      desktopWidth: desktop.clientWidth,
      desktopHeight: desktop.clientHeight,
      steps: measureSteps(element, resizeMode),
    }

    setLayout(start)
    setInteraction(direction ? 'resize' : 'drag')

    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    event.stopPropagation()
  }

  function moveInteraction(event) {
    const current = interactionRef.current

    if (!current || current.pointerId !== event.pointerId) {
      return
    }

    const {
      start,
      direction,
      desktopWidth,
      desktopHeight,
      steps,
    } = current

    const dx = event.clientX - current.pointerX
    const dy = event.clientY - current.pointerY
    const leftMargin = desktopWidth >= 400 ? 100 : 8

    const next = { ...start }

    if (!direction) {
      const maxX = Math.max(
        0,
        desktopWidth - start.width - 8,
      )

      next.x = clamp(
        start.x + dx,
        Math.min(leftMargin, maxX),
        maxX,
      )

      next.y = clamp(
        start.y + dy,
        38,
        Math.max(38, desktopHeight - 51),
      )
    } else {
      if (direction.includes('e') || direction.includes('w')) {
        const west = direction.includes('w')
        const rightEdge = start.x + start.width

        const maxWidth = Math.max(
          1,
          west
            ? rightEdge - leftMargin
            : desktopWidth - start.x - 8,
        )

        next.width = snapSize(
          start.width + (west ? -dx : dx),
          start.width,
          steps.x,
          280,
          maxWidth,
        )

        if (west) {
          next.x = rightEdge - next.width
        }
      }

      if (direction.includes('n') || direction.includes('s')) {
        const north = direction.includes('n')
        const bottomEdge = start.y + start.height

        const maxHeight = Math.max(
          1,
          north
            ? bottomEdge - 38
            : desktopHeight - start.y - 8,
        )

        next.height = snapSize(
          start.height + (north ? -dy : dy),
          start.height,
          steps.y,
          180,
          maxHeight,
        )

        if (north) {
          next.y = bottomEdge - next.height
        }
      }
    }

    current.latest = next
    setLayout(next)
  }

  function stopInteraction(event) {
    const current = interactionRef.current

    if (!current || current.pointerId !== event.pointerId) {
      return
    }

    saveLayout(storageKey, current.latest)

    interactionRef.current = null
    setInteraction(null)

    const captureElement = current.captureElement

    if (captureElement.hasPointerCapture(event.pointerId)) {
      captureElement.releasePointerCapture(event.pointerId)
    }
  }

  const classes = [
    'window',
    className,
    maximized ? 'is-maximized' : '',
    interaction === 'drag' ? 'is-dragging' : '',
    interaction === 'resize' ? 'is-resizing' : '',
  ].filter(Boolean).join(' ')

  const layoutStyle = layout
    ? {
        left: layout.x,
        top: layout.y,
        right: 'auto',
        bottom: 'auto',
        width: layout.width,
        height: layout.height,
        maxWidth: layout.width ? 'none' : undefined,
      }
    : {}

  return (
    <section
      ref={windowRef}
      className={classes}
      style={{ ...layoutStyle, zIndex }}
      hidden={hidden}
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
      onPointerMove={moveInteraction}
      onPointerUp={stopInteraction}
      onPointerCancel={stopInteraction}
      onLostPointerCapture={stopInteraction}
      aria-label={title}
    >
      <header
        className="window-titlebar"
        onPointerDown={event => startInteraction(event)}
      >
        <div className="window-titlebar__left">
          {icon}
        </div>

        <div className="window-title">{title}</div>

        <div className="window-controls">
          <button
            type="button"
            aria-label="Minimize"
            onClick={onMinimize}
          >
            −
          </button>

          <button
            type="button"
            aria-label={maximized ? 'Restore size' : 'Maximize'}
            onClick={() => setMaximized(previous => !previous)}
          >
            □
          </button>

          <button
            type="button"
            className="window-close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>
      </header>

      <div className="window-body">
        {children}
      </div>

      {!maximized && DIRECTIONS.map(direction => (
        <div
          key={direction}
          className={`resize-handle resize-handle--${direction}`}
          aria-hidden="true"
          onPointerDown={event => {
            startInteraction(event, direction)
          }}
        />
      ))}
    </section>
  )
}