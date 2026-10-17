import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getGamesFor } from './catalogue.js'
import { JackBoxIcon, MenuClown } from './JackBoxArt.jsx'
import { placeGamesMenu } from './gamesMenuPosition.js'
import './GamesDockMenu.css'

const DESKTOP_GAMES = getGamesFor('desktop')
const INITIAL_POSITION = { left: 100, top: 54, width: 320, maxHeight: 600 }

export default function GamesDockMenu({ onOpenGame, games = DESKTOP_GAMES }) {
    const [phase, setPhase] = useState('closed')
    const [position, setPosition] = useState(INITIAL_POSITION)
    const buttonRef = useRef(null)
    const flyoutRef = useRef(null)
    const menuRef = useRef(null)
    const closeTimerRef = useRef(null)
    const firstFocusRef = useRef('first')
    const menuId = useId()
    const open = phase === 'open'

    const closeMenu = useCallback((restoreFocus = false) => {
        window.clearTimeout(closeTimerRef.current)
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        setPhase(reducedMotion ? 'closed' : 'closing')
        if (!reducedMotion) closeTimerRef.current = window.setTimeout(() => setPhase('closed'), 180)
        if (restoreFocus) buttonRef.current?.focus({ preventScroll: true })
    }, [])

    function openMenu(focus = 'first') {
        window.clearTimeout(closeTimerRef.current)
        firstFocusRef.current = focus
        setPhase('open')
    }

    useEffect(() => () => window.clearTimeout(closeTimerRef.current), [])

    useLayoutEffect(() => {
        if (!open) return

        function updatePosition() {
            if (!buttonRef.current || !flyoutRef.current) return
            const next = placeGamesMenu(
                buttonRef.current.getBoundingClientRect(),
                { width: window.innerWidth, height: window.innerHeight },
                flyoutRef.current.offsetHeight,
            )
            setPosition(previous => Object.keys(next).every(key => next[key] === previous[key]) ? previous : next)
        }

        updatePosition()
        window.addEventListener('resize', updatePosition)
        const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updatePosition)
        if (flyoutRef.current) observer?.observe(flyoutRef.current)

        const items = menuRef.current?.querySelectorAll('[role="menuitem"]')
        if (items?.length) items[firstFocusRef.current === 'last' ? items.length - 1 : 0].focus({ preventScroll: true })

        return () => {
            window.removeEventListener('resize', updatePosition)
            observer?.disconnect()
        }
    }, [open, games.length])

    useEffect(() => {
        if (!open) return
        function isInside(target) {
            return buttonRef.current?.contains(target) || flyoutRef.current?.contains(target)
        }
        function onPointerDown(event) {
            if (!isInside(event.target)) closeMenu()
        }
        function onFocusIn(event) {
            if (!isInside(event.target)) closeMenu()
        }
        function onKeyDown(event) {
            if (event.key === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                closeMenu(true)
            }
        }
        function onBlur() { closeMenu() }
        document.addEventListener('pointerdown', onPointerDown, true)
        document.addEventListener('focusin', onFocusIn)
        document.addEventListener('keydown', onKeyDown, true)
        window.addEventListener('blur', onBlur)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown, true)
            document.removeEventListener('focusin', onFocusIn)
            document.removeEventListener('keydown', onKeyDown, true)
            window.removeEventListener('blur', onBlur)
        }
    }, [open, closeMenu])

    function onMenuKeyDown(event) {
        if (event.key === 'Tab') {
            // Let the browser continue tabbing from the dock button.
            closeMenu(true)
            return
        }
        const keys = ['ArrowDown', 'ArrowUp', 'Home', 'End']
        if (!keys.includes(event.key)) return
        event.preventDefault()
        const items = Array.from(menuRef.current.querySelectorAll('[role="menuitem"]'))
        if (!items.length) return
        const index = items.indexOf(document.activeElement)
        const next = event.key === 'Home' ? 0
            : event.key === 'End' ? items.length - 1
                : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length
        items[next].focus()
    }

    const portalHost = buttonRef.current?.closest('.desktop') ?? (typeof document === 'undefined' ? null : document.body)

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                className={`dock-item jack-games-button${open ? ' dock-item--focused' : ''}`}
                aria-label="Games"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={phase !== 'closed' ? menuId : undefined}
                onClick={() => open ? closeMenu(true) : openMenu()}
                onKeyDown={event => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                        event.preventDefault()
                        if (open) {
                            const items = menuRef.current?.querySelectorAll('[role="menuitem"]')
                            items?.[event.key === 'ArrowUp' ? items.length - 1 : 0]?.focus()
                        } else openMenu(event.key === 'ArrowUp' ? 'last' : 'first')
                    }
                }}
            >
                <span className="dock-app-icon jack-games-button__art"><JackBoxIcon open={open} /></span>
                {!open && <span className="dock-tooltip">Games</span>}
            </button>
            {phase !== 'closed' && portalHost && createPortal(
                <div
                    ref={flyoutRef}
                    className={`jack-games-flyout${phase === 'closing' ? ' is-closing' : ''}`}
                    aria-hidden={phase === 'closing' ? true : undefined}
                    inert={phase === 'closing' ? true : undefined}
                    style={{
                        left: position.left,
                        top: position.top,
                        width: position.width,
                        '--jack-max-height': `${position.maxHeight}px`,
                    }}
                >
                    <MenuClown />
                    <div className="jack-games-board">
                        <div className="jack-games-board__heading" id={`${menuId}-label`}>Games</div>
                        <div className="jack-games-list" id={menuId} ref={menuRef} role="menu" aria-labelledby={`${menuId}-label`} onKeyDown={onMenuKeyDown}>
                            {games.map(game => {
                                const contents = <><img src={game.iconSrc} alt="" draggable="false" /><span>{game.name}</span></>
                                return game.type === 'link' ? (
                                    <a key={game.id} role="menuitem" tabIndex={-1} className="jack-games-item" href={game.href} target="_blank" rel="noopener noreferrer" onClick={() => closeMenu(true)} onAuxClick={event => { if (event.button === 1) closeMenu(true) }}>
                                        {contents}
                                    </a>
                                ) : (
                                    <button key={game.id} type="button" role="menuitem" tabIndex={-1} className="jack-games-item" onClick={() => { closeMenu(); onOpenGame(game.id) }}>
                                        {contents}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>,
                portalHost,
            )}
        </>
    )
}
