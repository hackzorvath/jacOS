import { useEffect, useRef, useState } from 'react'
import './TopBar.css'
import { DEFAULT_RADIO_STATION } from './system/radio.js'

const APP_LABELS = {
    notes: 'Emacs',
    terminal: 'Terminal',
    courses: 'Courses',
    mess: 'mess',
    trash: 'Trash',
    backgrounds: 'Appearance',
}

const WINDOW_LABELS = {
    notes: 'notes.txt — Emacs',
    terminal: 'Terminal',
    courses: 'Courses',
    mess: 'mess — Files',
    trash: 'Trash',
    backgrounds: 'Backgrounds - Appearance',
}

function BackgroundIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
        >
            <rect
                x="3"
                y="4"
                width="18"
                height="16"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            />

            <circle
                cx="8"
                cy="9"
                r="1.5"
                fill="currentColor"
            />

            <path
                d="M4 17l5-5 4 4 2-2 5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

function RadioIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            aria-hidden="true"
        >
            {/* antenna */}
            <path
                d="M7 5l10-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            {/* radio body */}
            <rect
                x="3"
                y="6"
                width="18"
                height="14"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
            />

            {/* tuner display */}
            <rect
                x="6"
                y="9"
                width="7"
                height="3"
                rx="0.7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            />

            {/* tuner marker */}
            <path
                d="M9 9v3"
                stroke="currentColor"
                strokeWidth="1.2"
            />

            {/* speaker */}
            <circle
                cx="9.5"
                cy="16"
                r="2.3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            />

            <circle
                cx="17"
                cy="10"
                r="1.3"
                fill="currentColor"
            />

            {/* tuning knob */}
            <circle
                cx="17"
                cy="16"
                r="1.4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
            />
        </svg>
    )
}

function NetworkIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
        >
            <path
                d="
          M12 4v5
          M6 14v-3h12v3
          M4 14h4v4H4z
          M10 4h4v4h-4z
          M16 14h4v4h-4z
        "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}


function VolumeIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
        >
            <path
                d="
          M5 10v4h4l5 4V6l-5 4H5z
          M17 9c1 .8 1.5 1.8 1.5 3S18 14.2 17 15
        "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}


function PowerIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            aria-hidden="true"
        >
            <path
                d="
          M12 3v8
          M7.5 5.8
          A8 8 0 1 0 16.5 5.8
        "
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default function TopBar({
    activeApp,
    windows,
    onRestoreWindow,
    theme,
    onToggleTheme,
    onOpenBackgrounds,
}) {
    const [now, setNow] = useState(new Date())
    const audioRef = useRef(null)

    const [radioOn, setRadioOn] = useState(false)
    const [radioLoading, setRadioLoading] = useState(false)
    const [radioError, setRadioError] = useState(false)

    async function toggleRadio() {
        const audio = audioRef.current

        if (!audio) return

        if (radioOn) {
            audio.pause()
            setRadioOn(false)
            setRadioLoading(false)
            return
        }

        setRadioLoading(true)
        setRadioError(false)

        try {
            audio.volume = 0.35
            await audio.play()
        } catch (error) {
            console.error('jacOS Radio failed:', error)

            setRadioOn(false)
            setRadioLoading(false)
            setRadioError(true)
        }
    }

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNow(new Date())
        }, 30_000)

        return () => window.clearInterval(timer)
    }, [])

    const clockText = now.toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    })

    return (
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
                                onClick={() => onRestoreWindow(id)}
                            >
                                {WINDOW_LABELS[id]}
                            </button>
                        ))}
                </div>
            </div>

            <div
                className="topbar__clock"
                title={now.toLocaleString()}
            >
                {clockText}
            </div>

            <div className="topbar__right">

                {/* jacOS controls */}
                <audio
                    ref={audioRef}
                    src={DEFAULT_RADIO_STATION}
                    preload="none"

                    onPlaying={() => {
                        setRadioOn(true)
                        setRadioLoading(false)
                        setRadioError(false)
                    }}

                    onWaiting={() => {
                        setRadioLoading(true)
                    }}

                    onError={() => {
                        setRadioOn(false)
                        setRadioLoading(false)
                        setRadioError(true)
                    }}
                />

                <button
                    type="button"
                    className="topbar__control"
                    title="Change background"
                    aria-label="Change background"
                    onClick={onOpenBackgrounds}
                >
                    <BackgroundIcon />
                </button>
                <button
                    type="button"
                    className={`topbar__control topbar__radio ${radioOn ? 'topbar__control--active' : ''
                        }`}
                    aria-pressed={radioOn}
                    aria-label={
                        radioOn
                            ? 'Turn off jacOS Radio'
                            : 'Turn on jacOS Radio'
                    }
                    title={
                        radioOn
                            ? 'Turn off jacOS Radio'
                            : 'Station selection is managed by your organization.'
                    }
                    onClick={toggleRadio}
                >
                    <RadioIcon />

                    <span
                        className="topbar__radio-state"
                        aria-hidden="true"
                    >
                        {radioLoading ? '…' : radioOn ? '⏸' : '▶'}
                    </span>
                </button>

                <button
                    type="button"
                    className="topbar__control"
                    aria-label={
                        theme === 'dark'
                            ? 'Switch to light mode'
                            : 'Switch to dark mode'
                    }
                    title={
                        theme === 'dark'
                            ? 'Switch to light mode'
                            : 'Switch to dark mode'
                    }
                    onClick={onToggleTheme}
                >
                    <span aria-hidden="true">
                        {theme === 'dark' ? '☀' : '☾'}
                    </span>
                </button>


                <span className="topbar__separator" />


                {/* GNOME-ish system indicators */}

                <button
                    type="button"
                    className="topbar__status"
                    title="Wired connection"
                    aria-label="Network status"
                >
                    <NetworkIcon />
                </button>

                <button
                    type="button"
                    className="topbar__status"
                    title="Sound"
                    aria-label="Sound"
                >
                    <VolumeIcon />
                </button>

                <button
                    type="button"
                    className="topbar__status"
                    title="Power"
                    aria-label="Power"
                >
                    <PowerIcon />
                </button>

            </div>
        </header>
    )
}